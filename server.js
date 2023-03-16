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

app.use(express.json());

// gets all logs at a specific id
app.get('/api/v1/logs/:id/:courseid', (req, res) => {
  const uvuId = req.params.id;
  const courseId = req.params.courseid;
  const data = fs.readFileSync('./db.json', 'utf-8');
  const db = JSON.parse(data);

  const logs = db.logs.filter((log) => log.uvuId === uvuId);
  res.send(logs);
});

// gets all courses
app.get('/api/v1/courses', (req, res) => {
  const db = fs.readFileSync('./db.json', 'utf-8');
  const data = JSON.parse(db);
  const courses = data.courses.map((course) => course.display);
  const uniqueCourses = [...new Set(courses)];

  res.send(uniqueCourses);
});

// PUT method route
app.put('/api/v1/logs/:id', (req, res) => {
  const id = req.params.id;
  const newLog = req.body.log;

  const data = fs.readFileSync('./db.json', 'utf-8');
  const db = JSON.parse(data);

  const oldLog = db.logs.find((log) => log.id === id);

  // change in memeory right here i think
  oldLog.date = newLog.date;
  oldLog.text = newLog.text;

  // with so many people hitting the server, we have to stop it until this is done.
  fs.writeFile('./db.json', JSON.stringify(db, null, 2), () => {});
  res.send("success");
});

// POST method route
app.post('/api/v1/logs', (req, res) => {
  const uvuId = req.params;
  const newLog = req.body;

  const data = fs.readFileSync('./db.json', 'utf-8');
  const db = JSON.parse(data);

  db.logs.push({ uvuId, ...newLog });

  fs.writeFileSync('./db.json', JSON.stringify(db));
  res.send({ message: 'New log added successfully' });
});

// DELETE method route
app.delete('/api/v1/logs/:id', (req, res) => {

  const data = fs.readFileSync('./db.json', 'utf-8');
  const db = JSON.parse(data);
  
  const id = req.params.id;

  // Find the index of the log to delete in the "logs" array
  const logIndex = db.logs.findIndex((log) => log.id === id);

  // If the log with the specified ID is found, delete it from the "logs" array
  if (logIndex !== -1) {
    db.logs.splice(logIndex, 1);

    // Write the updated database to disk
    fs.writeFile('./db.json', JSON.stringify(db, null, 2), () => {});

    // Send a success response to the client
    res.sendStatus(204);
  } else {
    // If the log with the specified ID is not found, send a 404 error response
    res.sendStatus(404);
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
