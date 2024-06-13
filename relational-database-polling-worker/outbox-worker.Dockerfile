FROM node:18-alpine3.15
COPY node_modules /app/node_modules
COPY outbox-worker.js /app/outbox-worker.js
ENTRYPOINT ["node"]
CMD ["/app/outbox-worker.js"]