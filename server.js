const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

//const

// gets all logs at a specific id
app.get('/api/v1/logs/:id', (req, res) => {
  const uvuId = req.params.id;
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

  const oldLog = db.logs.find((log) => log.id === id);

  // change in memeory right here i think
  oldLog.data = newLog.date;
  oldLog.text = newLog.text;

  // with so many people hitting the server, we have to stop it until this is done.
  fs.writeFile('./db.json', JSON.stringify(db, null, 2), () => {});
  res.send(courses);
});

// POST method route
app.post('/api/v1/logs', (req, res) => {
  const uvuId = req.params.id;
  const newLog = req.body;

  const data = fs.readFileSync('./db.json', 'utf-8');
  const db = JSON.parse(data);

  db.logs.push({ uvuId, ...newLog });

  fs.writeFileSync('./db.json', JSON.stringify(db));
  res.send({ message: 'New log added successfully' });
});

// DELETE method route
app.delete('/', (req, res) => {
  res.send('DELETE request to the homepage');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.static('public')); // apache, nginx
