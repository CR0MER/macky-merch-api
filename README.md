# macky-merch-api
Macky Merch API is a RESTful backend of "Macky Merch" (The official LSCS merchandise). 

## Tech Stack
- **Language:** TypeScript
- **Environment:** Node.js
- **Server:** Express.js
- **Package Manager:** npm
- **Database:** MySQL
- **ORM:** Prisma
- **Validation:** Zod
- **Formatter:** Prettier
- **Containerization:** Docker
- **Testing:** Vitest, Supertest

## Getting Started

### Prerequisites
- Node.js 20+
- npm
- Docker Desktop (For the MySQL database)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy the example env files:
```bash
cp .env.example .env
cp .env.test.example .env.test
```
These already point at the credentials and ports the `docker-compose.yml` `db` service uses — no edits needed for local development.

### 3. Start the database
```bash
docker compose up -d db
```
Wait for it to report healthy:
```bash
docker compose ps
```

### 4. Apply the schema
```bash
npx prisma migrate deploy
```

### 5. Seed sample data (optional)
```bash
npm run seed
```

### 6. Run the server
```bash
npm run dev
```
API is now available at `http://localhost:3100`. You can confirm with:
```bash
curl http://localhost:3100/health
```

### 7. Run tests
Tests run against an isolated `macky_merch_test` database (from `.env.test`), separate from your dev data:
```bash
npm test
```

### Running everything with Docker instead
If you'd rather not run Node locally at all:
```bash
docker compose up --build
```
This builds the API image, waits for MySQL to report healthy, applies migrations, and starts the server all in containers.

## Architectural Explanation

**Folder Structure**: Uses layered architecture. This is also the practice used by LSCS according to the Backend Manual. The API currently has a single resource (`Product`) so the code is organized by technical layer (`routes` → `controllers` → `models` → `validators` → `middlewares` → `errors`). Each file has one job, routing, handling requests, talking to database, validating input which will make things easier to follow imo. 

**Database**: MySQL was chosen as it seems to be fairly used by LSCS members and for familiarity. It also has constraint support, and it makes containerization more meaningful. Prisma serves as the ORM for generating type-safe queries from the schema and to handle possible migrations (and I just wanted to try this out for learning purposes tbh).

## Challenges Faced
My main challenge was having low experience to backend work in general, so I was learning the stack and tools as I went. Three of them (Zod, Prisma, Docker) I'd never touched before, but I figured I'd use this project as a chance to learn how they worked, partly for STSWENG as well. To be able to work on this, I had AI assist me through development and explain tools being used on top of some tutorials/explanations online. 
