const express = require('express');
const path = require('path');
const breed = require('./info/breed');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '/../build')));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.get('/garden', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.get('/info', async (req, res) => {
  console.log('Getting breed info ...');
  try {
    const vegeName = req.query.vegeName;
    breedInfo = await breed.getBreedInfo(vegeName);
    res.send({markdown: breedInfo.data});
  } catch (error) {
    console.log(error);
    res.status(500).send({error: 'Getting breed info failure!'});
  }
});
