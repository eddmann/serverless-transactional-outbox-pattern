const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const { randomUUID } = require("crypto");

module.exports.handle = async () => {
  const title = randomUUID();

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

  await dynamo.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCT_TABLE_NAME,
            Item: {
              id: randomUUID(),
              title,
            },
          },
        },
        {
          Put: {
            TableName: process.env.EVENT_OUTBOX_TABLE_NAME,
            Item: {
              id: randomUUID(),
              event: JSON.stringify(event),
            },
          },
        },
      ],
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ title }, null, 2),
  };
};
