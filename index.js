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
      const query = {};
      const cursor = inventoryCollection.find(query);
      const result = await cursor.toArray();
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
