const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

// nodeCRUD
// B1I1uWrKhkW2h04g

const uri =
  'mongodb+srv://nodeCRUD:B1I1uWrKhkW2h04g@cluster0.vtstx9a.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollections = client.db('crudDatabase').collection('users');

    // get data from mongoDB server
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollections.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });

    // Post data to mongoDB server
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      console.log(result);
      res.send(result);
    });

    // update database data by id
    app.put('/users/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = { _id : ObjectId(id) };
      const user = req.body;
      const option = {upsert : true};
      const updatedUser ={
        $set : {
          name: user.name,
          address: user.address,
          email: user.email
        }
      }
      const result = await userCollections.updateOne(filter, updatedUser, option);
      res.send(result);
    })

    // get data by specific id
    app.get( '/users/:id' ,async (req, res)=>{
      const id = req.params.id;
      const query = { _id : ObjectId(id) };
      const user = await userCollections.findOne(query)
      res.send(user);
    })

    // delete from database
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id : ObjectId(id) };
      const result = await userCollections.deleteOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
}

run().catch((error) => console.log(error));

app.get('/', (req, res) => {
  res.send('server running , yay');
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
