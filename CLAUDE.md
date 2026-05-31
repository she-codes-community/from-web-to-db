# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack library management app built as a learning project. React/Vite frontend + Express 5/Mongoose backend. UI strings are in Hebrew.

Each git branch corresponds to a single lesson, containing only the code introduced in that lesson. A complete end-to-end reference solution (all lessons) lives at `/Users/roy.emek/coding.noindex/from-web-to-db-orig/` — you have read access to it.

## Running the App

Both projects must be started separately — there is no root-level script.

**Server** (runs on port 3000):
```bash
cd server && node library_server.js
```

**Client** (runs on port 5173):
```bash
cd client && npm run dev
```

## Environment Setup

The server requires a `.env` file in `server/`. Copy `server/.env.example` and fill in your MongoDB Atlas connection string:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/libraryDB
```

## Architecture

The app is split into two independent npm workspaces (`client/` and `server/`) with no shared code — each has its own `node_modules` and `package.json`.

**Server** (`server/library_server.js`) — single-file Express app wiring together:
- `auth.js` — bcrypt helpers, JWT `createToken`/`auth` middleware, `requireRoles` authorization middleware, and `validateEmailAndPassword`
- `mongodb.js` — `connectDB()` and `normalizeMongoId()` (converts Mongoose `_id` → `id` before sending responses)
- `mongomodels/book.js` / `mongomodels/user.js` — Mongoose schemas

**Client** (`client/src/`) — React SPA with react-router-dom v7:
- `App.jsx` — route definitions; redirects `/` to `/books` or `/login` based on `localStorage` token
- `authHeaders.js` — reads JWT from `localStorage` and returns `Authorization: Bearer <token>` header object, used in all authenticated fetch calls

## Key Conventions

- **Auth flow**: Login stores JWT in `localStorage`. `authHeaders()` on the client reads it for every request. The server `auth` middleware validates the JWT and attaches `req.userId` / `req.userRole` for downstream handlers.
- **Role-based access**: Only `librarian` role can delete books (`requireRoles("librarian")`). New users default to `reader`. Roles: `"reader"` | `"librarian"`.
- **MongoDB IDs**: The server uses Mongoose's `_id` internally. `normalizeMongoId()` normalizes documents to use `id` (string) before API responses. The client uses `b._id` directly (raw Mongoose documents are returned without normalization on most routes).
- **CORS**: Server is hardcoded to allow `http://localhost:5173`. Client fetch calls are hardcoded to `http://localhost:3000`.
- **JWT secret**: Currently hardcoded in `auth.js` as `"library-secret"` — not read from `.env`.
