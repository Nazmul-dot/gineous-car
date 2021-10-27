require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());
//nam:mydbuser
//pass;kHGpACtZVdnLrDVo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iohnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();

    const database = client.db("carMachenis");
    const serviseCollection = database.collection("services");

    //get api
    app.get("/service", async (req, res) => {
      const cursor = serviseCollection.find({});
      const service = await cursor.toArray();
      res.json(service);
    });
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      console.log("single", id);
      const qurey = { _id: ObjectId(id) };
      const singleservice = await serviseCollection.findOne(qurey);
      res.json(singleservice);
    });
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const qurey = { _id: ObjectId(id) };
      const singleservice = await serviseCollection.deleteOne(qurey);
      res.json(singleservice);
    });

    //post api
    app.post("/services", async (req, res) => {
      console.log(req.body);
      const service = req.body;
      const result = await serviseCollection.insertOne(service);
      res.json(result);
    });
    console.log("db connect");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("done");
});

app.listen(port, () => {
  console.log("server");
});
