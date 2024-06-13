const { Pool } = require("pg");
const { randomUUID } = require("crypto");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  min: 0,
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 10000,
});

// https://gist.github.com/streamich/6175853840fb5209388405910c6cc04b
module.exports.handle = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const title = randomUUID();

    await client.query("INSERT INTO product (title) VALUES ($1)", [title]);

    const event = {
      specversion: "1.0",
      id: randomUUID(),
      source: "product",
      type: "product.created",
      data: { title },
      time: new Date().toISOString(),
      dataschema: "",
      correlationid: randomUUID(),
    };

    await client.query("INSERT INTO event_outbox (event) VALUES ($1)", [JSON.stringify(event)]);

    await client.query("COMMIT");

    return {
      statusCode: 201,
      body: JSON.stringify({ title }, null, 2),
    };
  } finally {
    client.release(true);
  }
};
