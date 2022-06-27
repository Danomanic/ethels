import express from 'express';
import { engine } from 'express-handlebars';
import ethels from './data/ethels.json' assert { type : "json" };

const app = express();
const expressPort = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use('/', express.static('./src/public'))

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
    var ethel = ethels.Ethels.find(o => o.slug === req.params.slug);
    console.log(ethel);
    res.render('ethel', { title: ethel.name, ethel: ethel });
});

app.listen(expressPort);
console.log(`Server running on port ${expressPort}`);