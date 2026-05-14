import { noteService } from "./note-service.js";
import { STATUS_CODES } from "./constants.js";

/**
 * Standard error response generator.
 */
const createErrorResponse = (h, message, statusCode) => {
  return h.response({
    error: true,
    message,
    statusCode,
  }).code(statusCode);
};

export const addNoteHandler = async (request, h) => {
  try {
    const { title, tags, body } = request.payload;

    // Simple input validation
    if (!title || !body) {
      return createErrorResponse(h, "Title and body are required", STATUS_CODES.BAD_REQUEST);
    }

    const noteId = await noteService.addNote({ title, tags, body });

    return h.response({
      status: "success",
      message: "Note successfully added",
      data: {
        noteId,
      },
    }).code(STATUS_CODES.CREATED);
  } catch (error) {
    return createErrorResponse(h, "Failed to add note", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

export const getAllNotesHandler = async (request, h) => {
  try {
    const notes = await noteService.getAllNotes();
    return {
      status: "success",
      data: {
        notes,
      },
    };
  } catch (error) {
    return createErrorResponse(h, "Failed to retrieve notes", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

export const getNoteByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const note = await noteService.getNoteById(id);

    if (!note) {
      return createErrorResponse(h, "Note not found", STATUS_CODES.NOT_FOUND);
    }

    return {
      status: "success",
      data: {
        note,
      },
    };
  } catch (error) {
    return createErrorResponse(h, "Failed to retrieve note", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

export const editNoteByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, tags, body } = request.payload;

    // Simple input validation
    if (!title || !body) {
      return createErrorResponse(h, "Title and body are required", STATUS_CODES.BAD_REQUEST);
    }

    const isSuccess = await noteService.editNoteById(id, { title, tags, body });

    if (!isSuccess) {
      return createErrorResponse(h, "Failed to update note. ID not found", STATUS_CODES.NOT_FOUND);
    }

    return {
      status: "success",
      message: "Note successfully updated",
    };
  } catch (error) {
    return createErrorResponse(h, "An error occurred while updating the note", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

export const deleteNoteByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const isSuccess = await noteService.deleteNoteById(id);

    if (!isSuccess) {
      return createErrorResponse(h, "Failed to delete note. ID not found", STATUS_CODES.NOT_FOUND);
    }

    return {
      status: "success",
      message: "Note successfully deleted",
    };
  } catch (error) {
    return createErrorResponse(h, "An error occurred while deleting the note", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};
