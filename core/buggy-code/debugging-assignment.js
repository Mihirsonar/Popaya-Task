import express from "express";
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  res.send(user);
});

function getUserById(id) {
  const user = users.find(u => u.id === id);
  return user;
}

app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

function fetchExternalData() {
  return { message: "External data loaded" };
}

app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData();
  res.send(data);
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});

function generateNoteId() {
  return Math.floor(Math.random() * 1000);
}

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.send("Invalid input");
  }

  const newNote = {
    id: generateNoteId(),
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.send(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.send({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  const user = users.find(u => u.id == id);
  user.name = name;

  res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = req.params.userId;
  const userNotes = notes.filter(n => n.userId === Number(userId));
  res.send(userNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.send({ message: "User not found" });
  }

  res.send(user);
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  const total = Number(a) + Number(b);
  res.send({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});