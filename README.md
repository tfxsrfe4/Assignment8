# Assignment 8 — Sticky Notes API

Node.js + Express + Mongoose solution following a layered folder structure.

## Requirements
- Node.js 18+
- MongoDB local server or a MongoDB Atlas connection string

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `MONGODB_URI`.
3. Start MongoDB, then run:
   ```bash
   npm run dev
   ```
4. API runs on `http://localhost:3000`.

## Important design note
This assignment asks for the logged-in user's ID in query parameters. For consistency with that requirement, endpoints use `?userId=<MongoDB User _id>` (except where the assignment explicitly shows a route parameter). This is an educational assignment pattern, **not secure authentication**: a real app should verify a signed session/JWT and derive the user ID from it. The login endpoint below checks the email/password and returns the user ID, but does not issue a JWT.

## API examples (use JSON bodies)
### Users
- `POST /users/signup` — `{ "name":"Ziad", "email":"ziad@example.com", "password":"Pass1234", "phone":"01000000000", "age":20 }`
- `POST /users/login` — `{ "email":"ziad@example.com", "password":"Pass1234" }`
- `PATCH /users/:id?userId=<id>` — update `name`, `email`, `phone`, `age` (password ignored)
- `DELETE /users?userId=<id>` — delete user and their notes
- `GET /users?userId=<id>` — get user data

### Notes
- `POST /notes?userId=<id>` — `{ "title":"First Note", "content":"Hello" }`
- `PATCH /notes/:noteId?userId=<id>` — partial update
- `PUT /notes/replace/:noteId?userId=<id>` — replace title/content
- `PATCH /notes/all?userId=<id>` — `{ "title":"New Title" }`, updates all the user's note titles
- `DELETE /notes/:noteId?userId=<id>` — delete one note
- `GET /notes/paginate-sort?userId=<id>&page=1&limit=10`
- `GET /notes/:id?userId=<userId>` — get one note
- `GET /notes/note-by-content?userId=<id>&content=Workout%20Plan`
- `GET /notes/note-with-user?userId=<id>` — populate user email
- `GET /notes/aggregate?userId=<id>&title=Code%20Review%20Notes`
- `DELETE /notes?userId=<id>` — delete all user's notes

## Postman
Create requests using the paths above. Signup and login first, then copy the returned `_id` into `userId`. Save each request and export the collection as JSON for submission.

## Bonus
`bonus.js` solves LeetCode "Longest Common Prefix".
