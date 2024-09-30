import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const pgVersionQry = await database.query("SHOW server_version;");
  const maxConnectionsQry = await database.query("SHOW max_connections;");
  const dbName = process.env.POSTGRES_DB;
  const activeConnectionsQry = await database.query({
    text: "SELECT COUNT(*)::int AS active_connections FROM pg_stat_activity WHERE datname = $1",
    values: [dbName],
  });

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        pg_version: pgVersionQry.rows[0].server_version,
        max_connections: parseInt(maxConnectionsQry.rows[0].max_connections),
        active_connections: activeConnectionsQry.rows[0].active_connections,
      },
    },
  });
}

export default status;
