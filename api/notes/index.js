import { noteService } from "../../note-service.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const notes = await noteService.getAllNotes();
      return res.status(200).json({ status: "success", data: { notes } });
    }

    if (req.method === "POST") {
      const { title, tags, body } = req.body || {};

      if (!title || !body) {
        return res.status(400).json({ error: true, message: "Title and body are required" });
      }

      const noteId = await noteService.addNote({ title, tags, body });
      return res.status(201).json({ status: "success", message: "Note successfully added", data: { noteId } });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: true, message: "Method not allowed" });
  } catch (error) {
    console.error("API /api/notes error:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
}
