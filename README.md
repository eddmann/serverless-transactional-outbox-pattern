# Serverless Transactional Outbox Pattern

Exploration into ways that we can implement the [Transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html) within a Serverless setting.

- [Relational Database - Polling Worker](./relational-database-polling-worker/)
- [DynamoDB Streams - Change Data Capture](./dynamodb-streams-change-data-capture/)

## Unexplored alternatives

- **Relational Database - Lambda Trigger:** within Postgres we could use `LISTEN`/`NOTIFY` to invoke a [Lambda function](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL-Lambda.html) once the transaction has been successfully committed, so as to publish the events to EventBridge.
- **Single-Table DynamoDB Streams - Change Data Capture:** - Using a single-table DynamoDB design (or if you do not want to use a multi-table transaction), we could store an `event` property within the inserted/updated record which is then used to publish events to the EventBridge.
