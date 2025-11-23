const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())

// DB_USER_NAME=zap_shiftUSER
// DB_USER_PASS=PZP1AUNnNEM3VP5U
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.abvmfph.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
    res.send("Hello Zapshift")
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("zap-parcel")
    const parcelColl = db.collection("parcels")

    app.get('/parcels', async (req, res) => {
        const query = {};

        const {number} = req.query;
        if(number) {
            query.receivers_Phone = number
        }

        const cursor = parcelColl.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/parcels', async (req, res) => {
        const parcel = req.body;
        const result = await parcelColl.insertOne(parcel)
        res.send(result)
    })

    app.delete('/parcels/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id) }

      const result = await parcelColl.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`running port is ${port}`);
    
})