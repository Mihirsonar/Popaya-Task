import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3001";

function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setError("");

    try {
      if (editingId) {
        await axios.put(`${API}/notes/${editingId}`, form);
      } else {
        await axios.post(`${API}/notes`, form);
      }

      setForm({
        title: "",
        content: "",
      });

      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);

    setForm({
      title: note.title,
      content: note.content,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axios.delete(`${API}/notes/${id}`);
      fetchNotes();

      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`${API}/notes/${id}`);
      setSelectedNote(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">
          Notes Management System
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {editingId ? "Edit Note" : "Create Note"}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Enter note title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows="6"
                name="content"
                placeholder="Enter note content"
                value={form.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? "Update Note" : "Create Note"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Note Details</h2>

            {selectedNote ? (
              <>
                <h3 className="text-xl font-bold mb-3">
                  {selectedNote.title}
                </h3>

                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </>
            ) : (
              <p className="text-gray-500">
                Select a note to view details
              </p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            All Notes ({filteredNotes.length})
          </h2>

          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-500">No notes found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-bold mb-2 truncate">
                    {note.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {note.content}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleView(note.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(note)}
                      className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;