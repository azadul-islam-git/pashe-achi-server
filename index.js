import express from "express";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.send("welcome to pashe achi website");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
