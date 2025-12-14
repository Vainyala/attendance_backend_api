import { MongoClient } from 'mongodb';
import { env } from './env.js';

const client = new MongoClient(env.mongoUri);
await client.connect();

export const mongo = {
  client,
  db: client.db(), // default from URI
  audit: client.db().collection('audit_logs'),
  errors: client.db().collection('error_logs'),
};
