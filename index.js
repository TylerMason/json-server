require('dotenv').config()
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@mongopracticum.sayth8y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('my_database');
    const logs = database.collection('logs');
    // Query for a movie that has the title 'Back to the Future'
    const query = { uvuId: '10111111' };
    const log = await logs.findOne(query);
    
    console.log(log);
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);