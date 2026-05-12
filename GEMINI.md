# Notes App Back-End

A simple back-end API for a notes application built using **Node.js** and the **Hapi.js** framework. This project demonstrates basic CRUD (Create, Read, Update, Delete) operations with in-memory data persistence.

## Project Overview

- **Framework:** [Hapi.js](https://hapi.dev/)
- **Data Persistence:** In-memory (using a simple JavaScript array).
- **Key Features:**
  - Add a new note with a unique ID (generated via `nanoid`).
  - List all notes.
  - View details of a specific note by ID.
  - Edit an existing note.
  - Delete a note.

## Project Structure

- `server.js`: The entry point of the application where the Hapi server is initialized and started.
- `routes.js`: Defines the API endpoints and maps them to their respective handlers.
- `handler.js`: Contains the logic for processing API requests and managing the notes data.
- `notes.js`: Serves as the in-memory data store for notes.

## Building and Running

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Since `package.json` is currently missing from the root, you will need to initialize the project and install dependencies manually.

### TODO: Initialize Project
```bash
# Initialize npm
npm init -y

# Install dependencies
npm install @hapi/hapi nanoid lodash
```

### Running the Server
```bash
# Start the server
node server.js
```
The server will be available at `http://localhost:5000`.

## API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/notes` | Add a new note |
| `GET` | `/notes` | Get all notes |
| `GET` | `/notes/{id}` | Get a note by ID |
| `PUT` | `/notes/{id}` | Update a note by ID |
| `DELETE` | `/notes/{id}` | Delete a note by ID |

## Development Conventions

- **Response Format:** The API consistently returns JSON objects with `status`, `message` (for mutations), and `data` fields.
- **Port:** Defaults to `5000`.
- **CORS:** Enabled for all origins (`*`) by default in `server.js`.
- **ID Generation:** Uses `nanoid` (16 characters) for unique note identification.
- **Timestamps:** Notes include `createdAt` and `updatedAt` in ISO format.
