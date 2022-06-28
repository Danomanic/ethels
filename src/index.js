const express = require('express');
const { engine } = require('express-handlebars');
const compression = require('compression');
const ethels = require('./data/ethels.json');

const app = express();
const expressPort = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use('/', express.static('./src/public'));
app.use(compression());

app.get('/', (req, res) => {
  res.render('home', { ethels: ethels.Ethels });
});

app.get('/list', (req, res) => {
  res.render('list', { title: 'List of Ethels', ethels: ethels.Ethels });
});

app.get('/map', (req, res) => {
  res.render('map', { title: 'Ethel Map', ethels: ethels.Ethels });
});

app.get('/ethel/:slug', (req, res) => {
  const ethel = ethels.Ethels.find((o) => o.slug === req.params.slug);
  res.render('ethel', { title: ethel.name, ethel });
});

app.listen(expressPort);
console.log(`Server running on port ${expressPort}`);
