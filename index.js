import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = 8000;
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoclient = await connectToMongoDB();
const db = mongoclient.db("pashe-achi");
const eventCollection = db.collection("events");
const joinedEventCollection = db.collection("joinedEvents");

app.get("/", (req, res) => {
  res.send("welcome to pashe achi website");
});

// add event
app.post("/events", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await eventCollection.insertOne(data);
  res.send(result);
});

// show events
app.get("/events", async (req, res) => {
  const result = await eventCollection.find().toArray();
  res.send(result);
});

// show signle event
app.get("/events/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await eventCollection.findOne(query);
  res.send(result);
});

// joined event database
app.post("/joinedEvents", async (req, res) => {
  const data = req.body;
  const result = await joinedEventCollection.insertOne(data);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
