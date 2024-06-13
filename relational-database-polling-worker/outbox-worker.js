const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const { Client } = require("pg");

(async () => {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();

  const eb = new EventBridgeClient();

  while (true) {
    const result = await db.query("SELECT id, event FROM event_outbox WHERE published_at IS NULL LIMIT 1 FOR UPDATE");

    if (result.rowCount === 0) {
      console.log(".");
      await new Promise((res) => setTimeout(res, 10_000));
      continue;
    }

    const { id, event } = result.rows[0];

    console.log(JSON.stringify({ id, event }));

    await eb.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: process.env.EVENT_BUS_ARN,
            Source: event.source,
            DetailType: event.type,
            Detail: JSON.stringify(event),
          },
        ],
      })
    );

    await db.query("UPDATE event_outbox SET published_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
  }
})();
