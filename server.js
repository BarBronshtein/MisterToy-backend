const toyService = require('./services/toy-service');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3030;

// app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}/`);
});
const MAP_KEY = 'AIzaSyAl-v0FWCCcT0o6UrjDE17w4NIVtAa9AAI';
// const MAP_KEY = process.env.MAP_KEY
// Get api key
app.get('/api/map', (req, res) => {
  res.send(MAP_KEY);
});

// List of toys
app.get('/api/toy', (req, res) => {
  const filterBy = req.query;
  toyService
    .query(filterBy)
    .then(toys => res.send(toys))
    .catch(err => {
      console.log(err);
      return res.status(500).send('Cannot get toys');
    });
});
// Update toy
app.put('/api/toy/:toyId', (req, res) => {
  const toy = req.body;
  toyService
    .save(toy)
    .then(savedToy => res.send(savedToy))
    .catch(err => {
      console.log(err);
      res.status(500).send('Cannot update toy');
    });
});

// Create toy
app.post('/api/toy', (req, res) => {
  const toy = req.body;
  toyService
    .save(toy)
    .then(savedToy => res.send(savedToy))
    .catch(() => res.status(500).send('Cannot save toy'));
});
// Read toy
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params;

  toyService
    .getById(toyId)
    .then(toy => res.send(toy))
    .catch(() => res.status(500).send('Cannot get toy'));
});

// Delete toy
app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params;

  toyService
    .remove(toyId)
    .then(() => res.send('Removed'))
    .catch(() => res.status(500).send('Cannot remove toy'));
});
