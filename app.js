const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Kubo = require('./models/kubo');
const res = require('express/lib/response');

mongoose.connect('mongodb://localhost:27017/kubo', {
    useNewUrlParser: true,
    //useCreateIndex: true, - not supported
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected!");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/kubos', async (req, res) => {
    const kubos = await Kubo.find({});
    res.render('kubos/index', {kubos});
})

app.get('/kubos/new', (req, res) => {
    res.render('kubos/new');
})

app.post('/kubos', async (req, res) => {
    const kubo = new Kubo(req.body.kubo);
    await kubo.save();
    res.redirect(`/kubos/${kubo._id}`)
})
    

app.get('/kubos/:id', async (req, res) => {
    const kubo = await Kubo.findById(req.params.id)
    res.render('kubos/show', {kubo});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})