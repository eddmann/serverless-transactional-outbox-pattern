# DynamoDB Streams - Change Data Capture

Uses a Lambda bound to the `EventOutbox` DynamoDB table [stream](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) to publish _committed_ events to EventBridge.
This uses a [cross-table transaction](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html) to ensure that state and associated events are atomically committed.

## Resources

- https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html#transactional-implementation-cdc
