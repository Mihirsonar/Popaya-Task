const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let notes = [
  { id: 1, title: "First note", content: "This is the first note" },
  { id: 2, title: "Second note", content: "This is the second note" }
];

function getNextId() {
  let maxId = 0;

  for (const note of notes) {
    if (note.id > maxId) {
      maxId = note.id;
    }
  }

  return maxId + 1;
}

app.get("/notes", (req, res) => {
  res.send(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(function (item) {
    return item.id === id;
  });

  if (!note) {
    return res.status(404).send({ message: "Note not found" });
  }

  res.send(note);
});

app.post("/notes", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  if (!title || !content) {
    return res.status(400).send({ message: "Title and content are required" });
  }

  const newNote = {
    id: getNextId(),
    title: title,
    content: content
  };

  notes.push(newNote);
  res.status(201).send(newNote);
});

app.put("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const title = req.body.title;
  const content = req.body.content;
  const note = notes.find(function (item) {
    return item.id === id;
  });

  if (!note) {
    return res.status(404).send({ message: "Note not found" });
  }

  if (!title || !content) {
    return res.status(400).send({ message: "Title and content are required" });
  }

  note.title = title;
  note.content = content;

  res.send(note);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(function (item) {
    return item.id === id;
  });

  if (noteIndex === -1) {
    return res.status(404).send({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

app.listen(3001, () => {
  console.log("Notes API running on port 3001");
});