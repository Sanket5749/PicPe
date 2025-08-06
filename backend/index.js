const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter.js");
const PostRouter = require("./Routes/PostRouter.js");
const MessageRouter = require("./Routes/MessageRouter.js");
const CommentRouter = require("./Routes/CommentRouter.js");
const StoryRouter = require("./Routes/StoryRouter.js");
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

main()
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(cors());
app.use("/", AuthRouter);
app.use("/post", PostRouter);
app.use("/messages", MessageRouter);
app.use("/comments", CommentRouter);
app.use("/story", StoryRouter);

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(port, () => {
  console.log("Server is Listening");
});
