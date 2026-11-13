import express from "express";
import { MongoClient } from "mongodb";
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

// show event
app.get("/events", async (req, res) => {
  const result = await eventCollection.find().toArray();
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
