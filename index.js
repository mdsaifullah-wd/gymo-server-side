const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3001;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pgx6o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const inventoryCollection = client.db('inventory').collection('items');

const run = async () => {
  try {
    await client.connect();

    // Get All Items
    app.get('/inventory', async (req, res) => {
      const query = req.query;
      console.log(query);
      const cursor = inventoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Get Six Items
    app.get('/home/inventory/', async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Add Item
    app.post('/inventory', async (req, res) => {
      const data = req.body;
      const result = await inventoryCollection.insertOne(data);

      res.send(result);
    });

    // Get Specific Item
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.findOne(query);
      res.send(result);
    });

    // Update Item Quantity
    app.put('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const quantity = req.body.quantity;
      const soldItems = req.body.soldItems;
      const query = { _id: ObjectId(id) };
      const updateQuantity = {
        $set: { quantity, soldItems },
      };

      const result = await inventoryCollection.updateOne(query, updateQuantity);
      res.send(result);
    });

    // Delete Specific Item
    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await inventoryCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
};

run().catch(console.error);

app.get('/', (req, res) => {
  res.send('Test');
});

app.listen(port, () => {
  console.log('Server is running...');
});
