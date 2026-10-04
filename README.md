# URL Shortener Microservice

A production-grade, highly scalable, and independently deployable URL Shortener Microservice built with **TypeScript, Node.js, Fastify, PostgreSQL (Neon), and Redis (Upstash)**. Designed following industry-standard microservice patterns, featuring robust containerization, automated CI/CD pipelines, and zero-downtime architecture.

---

##  Live Demo & Documentation
- **Live Base URL:** [https://url-shortener-service-ur3h.onrender.com](https://url-shortener-service-ur3h.onrender.com)
- **Interactive Swagger Documentation:** [https://url-shortener-service-ur3h.onrender.com/docs](https://url-shortener-service-ur3h.onrender.com/docs)
- **Health Check Endpoint:** [https://url-shortener-service-ur3h.onrender.com/health](https://url-shortener-service-ur3h.onrender.com/health)

---

##  Key Features

- **High-Performance Routing:** Powered by **Fastify** for lightning-fast request parsing and low overhead compared to Express.
- **Secure Shortening:** Generates collision-resistant Base62 short hashes for clean URLs.
- **Distributed Rate Limiting:** Implements Redis-backed rate-limiting to prevent API abuse and DDoS attacks.
- **Redis Caching Layer:** Caches resolved URLs to reduce database load and ensure sub-millisecond redirection latency.
- **Robust Persistence:** Utilizes **Prisma ORM** with **PostgreSQL** for type-safe database operations and relational integrity.
- **API Key Security:** Protected endpoints enforced via secure `x-api-key` header authorization.
- **Observability & Logging:** Structured JSON logging (via Pino) with unique request ID tracking (`reqId`) for distributed tracing.
- **OpenAPI / Swagger UI:** Auto-generated, interactive API documentation with dynamic environment-aware server targets.
- **Production Containerization:** Multi-stage Docker build optimized with Alpine Linux, OpenSSL compatibility, and non-root security.
- **Automated CI/CD:** Integrated via **GitHub Actions** running automated integration tests with live service containers on every push.

---

##  Tech Stack

- **Runtime & Language:** Node.js (v22), TypeScript
- **Framework:** Fastify
- **Database & ORM:** PostgreSQL (Neon), Prisma ORM
- **Cache & Rate Limiter:** Redis (Upstash), `ioredis`, `@fastify/rate-limit`
- **Documentation:** `@fastify/swagger`, `@fastify/swagger-ui`
- **Testing:** Vitest
- **DevOps & CI/CD:** Docker, Docker Compose, GitHub Actions, Render Cloud

---

## 🏗️ System Architecture

```
Consumer Applications / Clients
          │
          │ HTTPS REST API (CORS enabled)
          ▼
┌─────────────────────────┐
| URL Shortener Microservice|
| Fastify + TypeScript    |
└────┬───────────────┬────┘
     │               │
     │ Read/Write    │ Cache & Rate Limit
     ▼               ▼
PostgreSQL       Redis Cache
 Database         & Counter
```

The service is fully stateless and built for horizontal scalability behind any standard load balancer.

 Project StructurePlaintexturl-shortener-service/

├── .github/
│   └── workflows/        # GitHub Actions CI pipeline configs
├── prisma/
│   └── schema.prisma     # Database schema and models
├── src/
│   ├── core/             # Core configurations (Redis, errors, etc.)
│   ├── modules/          # Feature-based domains (urls, health)
│   ├── app.ts            # Fastify application builder & plugins
│   └── server.ts         # Server bootstrap & lifecycle listener
├── tests/
│   └── integration/      # Vitest integration test suites
├── Dockerfile            # Multi-stage production container setup
├── docker-compose.yml    # Local multi-container orchestration
└── tsconfig.json         # TypeScript compiler configurations


## 🔌 API Endpoints

**Base URL:** `/api/v1`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/urls` | Create a short URL | Yes (`x-api-key`) |
| `GET` | `/api/v1/urls/:code` | Retrieve original URL metadata | No |
| `GET` | `/api/v1/urls/:code/analytics` | Fetch click counts and analytics | Yes (`x-api-key`) |
| `DELETE` | `/api/v1/urls/:id` | Delete a short URL record | Yes (`x-api-key`) |
| `GET` | `/:code` | Fast public redirect to the original URL | No |
| `GET` | `/health` | Service health check | No |
| `GET` | `/docs` | Interactive Swagger UI documentation | No |

---

## 📂 Project Structure

```text
url-shortener-service/
├── .github/
│   └── workflows/
│       └── ...              # GitHub Actions CI/CD workflows
│
├── prisma/
│   └── schema.prisma        # Database schema and models
│
├── src/
│   ├── core/                # Core configuration and infrastructure
│   │   ├── config/
│   │   ├── errors/
│   │   └── ...
│   │
│   ├── modules/             # Feature-based business domains
│   │   ├── urls/
│   │   └── health/
│   │
│   ├── app.ts               # Fastify application builder and plugins
│   └── server.ts            # Server bootstrap and lifecycle
│
├── tests/
│   └── integration/         # Vitest integration test suites
│
├── Dockerfile               # Multi-stage production container
├── docker-compose.yml       # Local PostgreSQL & Redis orchestration
├── tsconfig.json            # TypeScript compiler configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

---

## Local Development Setup

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) `v20+`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AkshatSharma555/url-shortener-service.git
cd url-shortener-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root based on `.env.example`.

Example:

```env
PORT=3000

DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener"

REDIS_URL="redis://localhost:6379"

API_KEY="your_super_secret_api_key"

NODE_ENV="development"
```

> Never commit the `.env` file or any production secrets to Git.

### 4. Start Infrastructure Containers

Start PostgreSQL and Redis using Docker Compose:

```bash
docker compose up -d
```

Verify that the containers are running:

```bash
docker compose ps
```

### 5. Run Database Migrations

Apply the Prisma database migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

### 6. Start the Development Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

Interactive Swagger API documentation:

```text
http://localhost:3000/docs
```

---

## Testing

Run the automated integration test suite using Vitest:

```bash
npm test
```

---

## Docker

### Build the Production Image

```bash
docker build -t url-shortener-service .
```

### Run the Container

```bash
docker run -p 3000:3000 --env-file .env url-shortener-service
```

The service will be available at:

```text
http://localhost:3000
```

### Docker Compose

For local development with PostgreSQL and Redis:

```bash
docker compose up -d
```

Stop the containers:

```bash
docker compose down
```

---

## Author

**Akshat Sharma**

- GitHub: [@AkshatSharma555](https://github.com/AkshatSharma555)
