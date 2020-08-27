const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//store all the documents
const documents = {};

const handleEvent = (type, data) => {
  if (type === "documentCreated") {
    const { id, title, content } = data;
    documents[id] = { id, title, content, comments: [] };
  }

  if (type === "commentCreated") {
    const { id, commentText, status, documentId } = data;
    const document = documents[documentId];

    document.comments.push({ id, commentText, status });
  }

  if (type === "commentUpdated") {
    const { id, commentText, status, documentId } = data;
    const document = documents[documentId];
    const comment = document.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.commentText = commentText;
  }
};

//endpoint to return documents with comments
app.get("/documents", (req, res) => {
  res.send(documents);
});

//endpoint to receive incoming event requests
app.post("/event", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  //console.log("Document collection", documents);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const res = await axios.get("http://event-bus-srv:4005/events");

  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
