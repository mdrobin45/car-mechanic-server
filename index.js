const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`;
const client = new MongoClient(uri);

async function insertData()
{
    try {
        await client.connect();
        const database = client.db('CarMechanic');
        const dbCollection = database.collection('Services');

        // Root
        app.get('/', async (req, res) =>
        {
            res.send('running node server');
        });

        // POST API
        app.post('/services', async (req, res) =>
        {
            const newService = req.body;
            const result = await dbCollection.insertOne(newService);
            res.send(result);
        });


        // GET API
        app.get('/services', async (req, res) =>
        {
            const cursor = dbCollection.find({});
            const makeArray = await cursor.toArray();
            res.send(makeArray);
        });


        // Get single service
        app.get('/services/:id', async (req, res) =>
        {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await dbCollection.findOne(filter);
            res.send(result);
        });


        // Update service
        app.put('/services/:id', async (req, res) =>
        {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const updateInfo = {
                $set: {
                    name: updatedService.name,
                    price: updatedService.price,
                    description: updatedService.description,
                    image: updatedService.image
                }
            };
            const result = await dbCollection.updateOne(filter, updateInfo);
            res.send(result);
        });

        // Delete service
        app.delete('/services/:id', async (req, res) =>
        {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await dbCollection.deleteOne(filter);
            res.send(result);
        });

        // App listen
        app.listen(port, () =>
        {
            console.log('Node js server running');
        });
    } finally {

    }
}
insertData();
