var apm = require('elastic-apm-node').start({
  serviceName: 'es-queue'
});

const elasticsearch = require('elasticsearch');

module.exports = (params) => {
  const client = new elasticsearch.Client(params);

  let queue = [];
  let ready = Promise.resolve();

  const drain = () => {
    if (queue.length <= 0) return Promise.resolve();
    const trans = apm.startTransaction(`Job ${getNextId()}`, 'index');
    const body = queue.splice(0, 5000);
    console.log(`Indexing ${body.length / 2} docs...`);
    const result = client.bulk({body});
    return result.then(() => {
        trans.result = 'success';
        trans.end();
        return drain();
      })
      .catch(err => {
        trans.result = 'failure';
        trans.end();
      });
  };

  return (index, type, docs) => {
      // return ready = docs.reduce((acc, body) => {
      //     return acc.then(() => client.index({index, type, body}))
      // }, ready);
    docs.forEach(doc => {
      queue.push({index: {_index: index}}, doc);
    });
    return (ready = ready.then(drain));
  };
}

let i = 0;
function getNextId() {
  return ++i;
}
