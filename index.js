require('dotenv').config();
const { MongoClient } = require('mongodb');const express = require('express');
const cors = require("cors");
const app = express();
const ObjectId = require('mongodb').ObjectId;

const port = 4000;

// middleware
app.use(cors());
app.use(express.json());


const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odfms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log("Succesfully coneected to database");
        const database = client.db("genius-car-mechanics");
        const serviceCollection = database.collection("services");

        // get api
        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        // get single service
        app.get('/services/:id',async (req,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.json(result);
        })
        // delete api
        app.delete('/services/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {id:ObjectId(id)
            };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
        // post api
        app.post('/services',async(req,res) =>{
            const doc = req.body;
            const result = await serviceCollection.insertOne(doc);
            console.log("hitted", result);
            res.json(result);
        })

    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Hello from server");
})

app.listen(port,()=>{
    console.log("Hello from ", port);
})