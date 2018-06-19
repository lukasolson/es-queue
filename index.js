const elasticsearch = require('elasticsearch');

module.exports = (params) => {
  const client = new elasticsearch.Client(params);

  let queue = [];
  let ready = Promise.resolve();

  const drain = () => {
    if (queue.length <= 0) return Promise.resolve();
    const body = queue.splice(0, 5000);
    console.log(`Indexing ${body.length / 2} docs...`);
    const result = client.bulk({body});
    return result.then(drain);
  };

  return (index, type, docs) => {
    docs.forEach(doc => {
      queue.push({index: {_index: index, _type: type}}, doc);
    });
    return (ready = ready.then(drain));
  };
}
