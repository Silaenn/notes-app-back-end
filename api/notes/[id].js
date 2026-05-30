import { noteService } from "../../note-service.js";

export default async function handler(req, res) {
  try {
    // Vercel provides parsed query for dynamic routes
    const id = (req.query && req.query.id) || (req.url && req.url.split("/").pop().split("?")[0]);

    if (!id) {
      return res.status(400).json({ error: true, message: "ID is required" });
    }

    if (req.method === "GET") {
      const note = await noteService.getNoteById(id);
      if (!note) return res.status(404).json({ error: true, message: "Note not found" });
      return res.status(200).json({ status: "success", data: { note } });
    }

    if (req.method === "PUT") {
      const { title, tags, body } = req.body || {};
      if (!title || !body) return res.status(400).json({ error: true, message: "Title and body are required" });

      const isSuccess = await noteService.editNoteById(id, { title, tags, body });
      if (!isSuccess) return res.status(404).json({ error: true, message: "Failed to update note. ID not found" });

      return res.status(200).json({ status: "success", message: "Note successfully updated" });
    }

    if (req.method === "DELETE") {
      const isSuccess = await noteService.deleteNoteById(id);
      if (!isSuccess) return res.status(404).json({ error: true, message: "Failed to delete note. ID not found" });
      return res.status(200).json({ status: "success", message: "Note successfully deleted" });
    }

    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ error: true, message: "Method not allowed" });
  } catch (error) {
    console.error("API /api/notes/[id] error:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
}
