const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const ADMIN = process.env.MONGO_ADMIN;
const PW = process.env.MONGO_PW;
const DBNAME = process.env.DBNAME;
const uri = `mongodb+srv://${ADMIN}:${PW}@cluster0.7lsr0.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connection successful");
});

const dataSchema = mongoose.Schema({
    sector: { 
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: false
    },
    date: String,
    sentiment: String,
    summary: String
})

const Data = db.model("Data", dataSchema)

module.exports = Data;