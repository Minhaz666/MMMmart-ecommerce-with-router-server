const express=require('express')
const app=express();
const port= process.env.PORT || 5000;
const cors=require('cors') 
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleWare
app.use(cors());
app.use(express.json());

const user= process.env.DB_USER;
const pass=process.env.DB_PASS;

// mongoDb

const uri = `mongodb+srv://${user}:${pass}@clusterfirst.7ajn2mv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //database creat
    const database = client.db("emaJohnDB");
    const productsDB = database.collection("products");
    
    app.get('/products',async(req,res)=>{
        // console.log(req.query)
        const page = req.query.page || 0;
        const limit=req.query.limit || 10;
        const skip=page*limit;
        const result = await productsDB.find().skip(skip).limit(10).toArray()
        res.send(result)
    })
    app.get('/totalproduct',async(req,res)=>{
        const result = await productsDB.estimatedDocumentCount()
        res.send({totalProduct:result})
    })

    app.post('/productByIds',async(req,res)=>{
        const ids=req.body;
        console.log(ids)
        const objectIds=ids.map(id=>new ObjectId(id))
        const query={_id: { $in: objectIds }}
        const result = await productsDB.find(query).toArray();
        res.send(result)
    })

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

