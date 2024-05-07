var express = require('express');
var app = express();
require('dotenv').config();
// var routes = require ('./routes//routes');
const cors = require('cors');
var mongoose = require('mongoose');

const PORT = process.env.Port || 8000;


mongoose.connect(process.env.MongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
    .then(() => {
        console.log("MongoDb Connected Successfully");
    })
    .catch((err) => console.log("Connection Error", err));

app.use(cors());
app.use(express.json());
// app.use(routes);

app.listen(PORT, () => {
    console.log("App is Running on Port", PORT);
})