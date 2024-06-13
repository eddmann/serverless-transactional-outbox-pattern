# Relational Database - Polling Worker

Uses a long-running worker (within Fargate) to publish _committed_ events (found in the outbox) to EventBridge.
This takes advantage of the relational databases transactional boundary to ensure that state and associated events are atomically committed.

## Setup

**Note:** https://neon.tech/ is useful for experimentation.

```sql
CREATE TABLE event_outbox (id SERIAL PRIMARY KEY, event JSONB NOT NULL, published_at TIMESTAMP);
CREATE INDEX event_outbox_unpublished_index ON event_outbox (id) WHERE (published_at IS NULL)
```

```sql
CREATE TABLE product (id SERIAL PRIMARY KEY, title TEXT NOT NULL);
```

## Resources

- https://neon.tech/
- https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html#transactional-implementation-rdb
- https://martendb.io/events/subscriptions.html#event-subscriptions
- https://microservices.io/patterns/data/transactional-outbox.html
