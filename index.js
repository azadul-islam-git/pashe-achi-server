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

// show 6 recent event
app.get("/upcomingEvents", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const result = await eventCollection
    .find({
      eventDate: { $gte: today },
    })
    .sort({ eventDate: 1 })
    .limit(6)
    .toArray();

  res.send(result);
});

// show signle event
app.get("/events/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await eventCollection.findOne(query);
  res.send(result);
});

// get all event that the user created
app.get("/myEvents/:email", async (req, res) => {
  const { email } = req.params;
  const result = await eventCollection
    .find({ creatorEmail: email })
    .sort({ eventDate: 1 })
    .toArray();
  res.send(result);
});

// delete event that login user created
app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const result = await eventCollection.deleteOne({
    _id: new ObjectId(id),
    creatorEmail: email,
  });
  res.send({
    message: "Event deleted successfully",
    deletedCount: result.deletedCount,
  });
});

// edit event
app.patch("/events/:id", async (req, res) => {
  const { id } = req.params;

  const {
    email,
    title,
    description,
    eventType,
    thumbnail,
    location,
    eventDate,
  } = req.body;

  // Update only the event created by this user
  const result = await eventCollection.updateOne(
    {
      _id: new ObjectId(id),
      creatorEmail: email,
    },
    {
      $set: {
        title,
        description,
        eventType,
        thumbnail,
        location,
        eventDate,
      },
    },
  );

  res.send({
    message: "Event updated successfully",
    modifiedCount: result.modifiedCount,
  });
});

//* joined event database
// send data
app.post("/joinedEvents", async (req, res) => {
  const data = req.body;
  const result = await joinedEventCollection.insertOne(data);
  res.send(result);
});

// get all joined event
app.get("/joinedEvents", async (req, res) => {
  const result = await joinedEventCollection.find().toArray();
  res.send(result);
});

// get event by log in user
app.get("/joinedEvents/:email", async (req, res) => {
  const { email } = req.params;

  const result = await joinedEventCollection
    .find({ "user.email": email })
    .sort({ "event.eventDate": 1 })
    .toArray();
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
