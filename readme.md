# es-queue

Queue up large datasets to be indexed into Elasticsearch.

## Usage

```javascript
// Initialize the queue
const enqueue = require('es-queue')({
  host: 'elastic:changeme@localhost:9200'
  // And any other params to initialize the ES client
});

// Enqueue docs to be indexed
const promise = enqueue(index, type, docs);
```
