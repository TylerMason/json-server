const express = require('express');
require('dotenv').config()
const { MongoClient } = require("mongodb");


const app = express();
const port = 3000;
const fs = require('fs');

// create application/json parser
const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@mongopracticum.sayth8y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const database = client.db('my_database');
const logs = database.collection('logs');
const courses = database.collection('courses');

app.use(express.json());

// gets all logs at a specific id
app.get('/api/v1/logs/:id/:courseid', async (req, res) => {
  const uvuId = req.params.id;
  const courseId = req.params.courseid;
  // const data = fs.readFileSync('./db.json', 'utf-8');
  // const db = JSON.parse(data);

  // const logs = db.logs.filter((log) => log.uvuId === uvuId);
  // res.send(logs);
  try {
    const cursor = logs.find({ uvuId: uvuId, courseId: courseId });
    const logsArray = await cursor.toArray();
    if (logsArray.length > 0) {
      res.send(logsArray);
    } else {
      res.status(404).send({ message: 'Logs not found' });
    }
  } catch (error) {
    console.error('Error fetching log:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// gets all courses
app.get('/api/v1/courses', async(req, res) => {
  try {
    const cursor = courses.find();
    const coursesArray = await cursor.toArray();
    if (coursesArray.length > 0) {
      // get only the course string value that we want to display
      const displayArray = coursesArray.map(item => item.display);
      res.send(displayArray);
    } else {
      res.status(404).send({ message: 'Logs not found' });
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
  
});

// PUT method route
app.put('/api/v1/logs/:id', async (req, res) => {
  // const id = req.params.id;
  // const newLog = req.body.log;

  // const data = fs.readFileSync('./db.json', 'utf-8');
  // const db = JSON.parse(data);

  // const oldLog = db.logs.find((log) => log.id === id);

  // // change in memeory right here i think
  // oldLog.date = newLog.date;
  // oldLog.text = newLog.text;

  // // with so many people hitting the server, we have to stop it until this is done.
  // fs.writeFile('./db.json', JSON.stringify(db, null, 2), () => {});
  // res.send("success");
  try {
    const id = req.params.id;
    const newLog = req.body.log;
    const newText = newLog.text;

    const result = await logs.updateOne({ id: id}, {$set: newLog});

    if (result.modifiedCount > 0) {
      res.send('Log updated successfully');
    } else {
      res.status(404).send({ message: 'Log not found' });
    }
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// POST method route
app.post('/api/v1/logs', async (req, res) => {
  //const uvuId = req.params;
  const newLog = req.body;

  try {
    const result = await logs.insertOne(newLog);
    res.status(201).send({ message: 'Log created', _id: result.insertedId });
  } catch (error) {
    console.error('Error inserting log:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// DELETE method route
app.delete('/api/v1/logs/:id', async (req, res) => {

  // const data = fs.readFileSync('./db.json', 'utf-8');
  // const db = JSON.parse(data);
  
  // const id = req.params.id;

  // // Find the index of the log to delete in the "logs" array
  // const logIndex = db.logs.findIndex((log) => log.id === id);

  // // If the log with the specified ID is found, delete it from the "logs" array
  // if (logIndex !== -1) {
  //   db.logs.splice(logIndex, 1);

  //   // Write the updated database to disk
  //   fs.writeFile('./db.json', JSON.stringify(db, null, 2), () => {});

  //   // Send a success response to the client
  //   res.sendStatus(204);
  // } else {
  //   // If the log with the specified ID is not found, send a 404 error response
  //   res.sendStatus(404);
  // }

  try {
    const id = req.params.id;

    const result = await logs.deleteOne({ id: id });

    if (result.deletedCount > 0) {
      res.send('Log deleted successfully');
    } else {
      res.status(404).send({ message: 'Log not found' });
    }
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const gracefulShutdown = async () => {
  console.log('Shutting down the server gracefully...');
  await client.close();
  // Perform your custom actions here, e.g. close database connections, release resources, etc.

  server.close(() => {
    console.log('Server has been shut down gracefully.');
    
    process.exit(0);
  });
};

// Listen for shutdown signals
process.on('SIGINT', gracefulShutdown); // Catches 'ctrl+c' event
process.on('SIGTERM', gracefulShutdown); // Catches 'kill' event

app.use(express.static('public')); // apache, nginx
