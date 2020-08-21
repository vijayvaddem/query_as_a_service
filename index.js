const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//store all the documents
const documents = {};

//endpoint to return documents with comments
app.get("/documents", (req, res) => {
  res.send(documents);
});

//endpoint to receive incoming event requests
app.post("/event", (req, res) => {
  const { type, data } = req.body;

  console.log("Req Type is", type);

  if (type === "documentCreated") {
    const { id, title, content } = data;
    documents[id] = { id, title, content, comments: [] };
  }

  if (type === "commentCreated") {
    const { id, commentText, documentId } = data;
    const document = documents[documentId];

    document.comments.push({ id, commentText });
  }

  console.log("Document collection", documents);
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
