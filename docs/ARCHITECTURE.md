# Architecture Decision Record (ADR) & System Logic

## 1. Core Architecture Strategy
- **Pattern:** Stateless Microservice.
- **Routing & Framework:** Fastify (Chosen for low overhead and native JSON schema validation).
- **Modularity:** Domain-Driven Structure (Features are encapsulated in their own folders rather than global MVC layers).

## 2. Directory Philosophy
- `src/core/`: Contains infrastructure logic (errors, logging, config) that is domain-agnostic.
- `src/modules/`: Contains business domains (e.g., `urls/`, `health/`). Each module manages its own controllers, services, and schemas.
- **Rule:** Keep files small. If a function does one complex mathematical or string operation, it gets its own independent file in a `utils/` or `core/` directory.

## 3. Database Layer Strategy
- **ORM:** Prisma (Chosen for best-in-class TypeScript safety and developer experience).
- **Database Engine:** Relational DB (PostgreSQL/MySQL) via Prisma abstraction. Relational model ensures strict constraints (e.g., unique short codes).
- **Connection:** Managed via `DATABASE_URL` environment variable.


## 4. URL Shortening Algorithm
- **Algorithm:** Secure Random Base62 String (7 characters).
- **Library:** Node.js native `crypto` module (No 3rd party dependencies for core logic).
- **Collision Strategy:** 62^7 combinations provide extremely low collision probability. The database `@unique` constraint acts as a fallback fail-safe.

## 5. Security & Authentication
- **Strategy:** Static API Key authentication via custom Fastify `preHandler` hook.
- **Implementation:** Clients must pass the `x-api-key` header.
- **Scope:** Applied to API routes (Creation & Analytics). Redirection routes remain public.

## 6. Rate Limiting & Caching
- **Tool:** `@fastify/rate-limit` backed by Upstash Redis (via `ioredis`).
- **Distributed Strategy:** Uses Redis as a centralized store so rate limits remain consistent across multiple horizontally scaled containers.
- **Behavior:** Returns HTTP 429 Too Many Requests when the limit is exceeded.

## 7. Error Handling Strategy
- **Format:** Standardized JSON error structure (`{ error: { code, message, details } }`).
- **Security:** Stack traces are completely suppressed in production responses and logged securely via Fastify's internal structured logger.

## 8. Logging & Observability
- **Engine:** Pino (via Fastify built-in logger) for high-performance structured JSON logging.
- **Tracing:** Unique request IDs (`reqId`) are generated per request for end-to-end debugging.
- **API Documentation:** Automatically served via `@fastify/swagger` and `@fastify/swagger-ui` at `/docs`.