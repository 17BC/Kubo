const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Kubo = require('../models/kubo');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Kubo.deleteMany({});
   for (let i = 0; i < 50; i++){
       const random1000 = Math.floor(Math.random() * 1000);
       const kubo = new Kubo({
           location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
       await kubo.save();
   }
}

seedDB().then(() => {
    mongoose.connection.close()
})