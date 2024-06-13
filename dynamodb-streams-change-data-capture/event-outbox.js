const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const client = new EventBridgeClient();

module.exports.handle = async (streamEvent) => {
  for (const record of streamEvent.Records) {
    if (record.eventName !== "INSERT") {
      continue;
    }

    console.log(record);

    const event = JSON.parse(record.dynamodb.NewImage.event.S);

    await client.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: process.env.EVENT_BUS_ARN,
            Source: event.source,
            DetailType: event.type,
            Detail: record.dynamodb.NewImage.event.S,
          },
        ],
      })
    );
  }
};
