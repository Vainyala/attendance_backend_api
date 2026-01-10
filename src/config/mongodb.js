// config/mongodb.js
const { MongoClient } = require('mongodb');
const { env } = require('./env.js');

async function initMongo() {
  const client = new MongoClient(env.mongoUri);
  await client.connect();

  return {
    client,
    db: client.db(), // default DB from URI
    audit: client.db().collection('audit_logs'),
    errors: client.db().collection('error_logs'),
  };
}

// Export a promise that resolves to the mongo object
module.exports = {
  mongo: initMongo()
};
