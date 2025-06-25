const express = require('express')
const { MongoClient } = require('mongodb');
const bodyparser=require('body-parser')

const cors=require("cors")

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

let dotenv = require('dotenv')
dotenv.config()

//database name
const dbName = 'PassM';
const app = express()
const port = 3000
app.use(bodyparser.json())
app.use(cors())


client.connect();

app.get('/', async (req, res) => {
    const db =await client.db(dbName);
    const collection = db.collection('passwords');
    const findresult=await collection.find({}).toArray();
    res.json(findresult)
})

//Save Pass
app.post('/', async (req, res) => {
    const password=req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findresult=await collection.insertOne(password);
    res.send({success:true})
})

//Delete Pass
app.delete('/', async (req, res) => {
    const password=req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findresult=await collection.deleteOne(password);
    res.send({success:true})
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
