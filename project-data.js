window.PORTFOLIO_PROJECTS = {
  "rate-limiter": {
    id: "rate-limiter",
    title: "Distributed Rate Limiter Service",
    eyebrow: "Backend / Distributed Systems",
    subtitle: "High-throughput distributed rate-limiting middleware engineered to prevent cascading service failure and regulate API traffic with sub-5ms decision latency.",
    image: "assets/project/distributed-rate-limiter-banner.svg",
    github: "https://github.com/sharmaVishal2/Distributed-Rate-Limiter",
    live: null,
    stack: ["Java", "Spring Boot", "Redis", "PostgreSQL", "Docker", "Spring Data JPA", "JUnit 5"],
    overview: "A production-oriented distributed rate-limiting middleware engineered in Spring Boot and Redis to protect microservices from burst traffic, denial-of-service, and cascading resource exhaustion. Designed to enforce per-client and per-endpoint throttling across horizontally scaled instances with sub-5ms decision latency.",
    problem: "In distributed microservice architectures, unmetered client bursts can rapidly saturate downstream databases and thread pools, triggering cascading service outages. Local in-memory limiters (e.g. Guava RateLimiter) fail across multi-node clusters because rate state is isolated per instance. The challenge was building a low-latency, thread-safe distributed rate limiter that avoids race conditions under heavy concurrent request spikes without introducing an unacceptable latency penalty on critical API paths.",
    solution: "Designed a centralized high-speed coordination layer using Redis atomic operations and Redis Lua scripts combined with Spring Boot HTTP interceptors. Requests are evaluated in under 5ms, tracking tokens across all cluster nodes in real time. Rule definitions and client metadata are persisted in PostgreSQL with local caching, ensuring high resilience and configurable throttling policies per client tier.",
    tradeoffs: [
      "Token Bucket vs. Sliding Window Log: Sliding Window Log offers strict zero-burst precision but suffers from O(N) memory complexity per user where N is request count. Token Bucket was chosen for high-throughput endpoints because it allows controlled bursts while maintaining steady state with O(1) memory per client and single-roundtrip Redis evaluation.",
      "Redis Lua Scripting vs. Multi-command Transactions: Multi-roundtrip Redis commands introduce network latency and race conditions. Encapsulating token deduction and timestamp validation into atomic Lua scripts executed server-side in Redis eliminated concurrency anomalies and reduced network roundtrips to 1.",
      "Resilience & Fail-Open Strategy: In the event of a Redis cluster partition or timeout, the middleware implements a configurable fail-open circuit breaker with metrics logging to preserve user-facing availability rather than blocking legitimate traffic unconditionally."
    ],
    architecture: [
      "Client Request via API Gateway / Reverse Proxy",
      "Spring Boot HTTP Request Interceptor & API Key Extractor",
      "Redis Atomic Token State Store (Lua Script & INCR/EXPIRE)",
      "PostgreSQL Rule Repository & Client Tier Metadata",
      "Standardized HTTP Headers (X-RateLimit-Limit, Remaining, Reset)",
      "429 Too Many Requests Handler with Retry-After Header"
    ],
    features: [
      "Token Bucket & Sliding Window Counter throttling algorithms implemented with sub-5ms evaluation latency",
      "Thread-safe atomic Redis operations ensuring zero state drift across multiple backend instances",
      "Granular rule management supporting per-client IP, authenticated user ID, and API endpoint quotas",
      "Automatic injection of standard RFC rate-limiting HTTP response headers",
      "PostgreSQL persistence with JPA/Hibernate for rule lifecycle management and audit logs",
      "Comprehensive concurrency test suite built with JUnit 5 and Testcontainers"
    ],
    challenges: "The most significant challenge was eliminating race conditions when multiple concurrent requests from the same client hit different backend nodes simultaneously. Naive check-then-set logic caused token over-allocation. Consolidating the token refill calculation, balance decrement, and TTL update into an atomic Redis Lua script resolved the race condition while keeping overhead below 3ms.",
    future: [
      "Implement multi-region distributed synchronization using Redis CRDTs (Conflict-Free Replicated Data Types)",
      "Add dynamic adaptive rate limiting based on backend CPU and database connection pool saturation metrics",
      "Integrate Prometheus & Grafana dashboard metrics for real-time traffic rejection analytics"
    ]
  },
  "ecommerce": {
    id: "ecommerce",
    title: "E-Commerce Backend System",
    eyebrow: "Backend / Security & Architecture",
    subtitle: "Production-grade commerce platform engineered with Spring Boot, Spring Security, OAuth2, JWT authentication, and a fully normalized PostgreSQL domain model.",
    image: "assets/project/ecommerce-banner.svg",
    github: "https://github.com/sharmaVishal2/E-Commerce-Application-by-Java-Spring-Boot",
    live: null,
    stack: ["Java", "Spring Boot", "Spring Security", "OAuth2", "JWT", "PostgreSQL", "Hibernate", "Maven"],
    overview: "A robust, production-ready e-commerce backend built with Spring Boot that handles complete catalog management, multi-tier user authentication, shopping carts, order fulfillment workflows, and admin controls. Engineered with strict role-based access control (RBAC), transactional integrity across checkout operations, and an optimized relational schema.",
    problem: "Many full-stack e-commerce prototypes fail in real-world scenarios due to insecure authentication implementations, flat un-normalized schemas, race conditions during inventory checkout, and leaky abstraction boundaries. The objective was to build a secure, maintainable backend adhering to enterprise standards — strict RBAC, stateless security filter chains, ACID transactions for order workflows, and clean RESTful resource modeling.",
    solution: "Architected a layered Spring Boot application decoupling controllers, service interfaces, data access objects, and security filters. Enforced stateless JWT authentication and OAuth2 third-party login at the filter level. Designed a normalized PostgreSQL schema with composite indexing, foreign key cascade constraints, and optimistic locking on inventory stock to prevent overselling.",
    tradeoffs: [
      "Stateless JWT vs. Stateful Server Sessions: Stateless JWT was chosen to enable seamless horizontal scaling without sticky sessions; token revocation is handled via short expiration TTLs paired with refresh token validation.",
      "Optimistic vs. Pessimistic Locking on Inventory: Implemented optimistic version checking on inventory entities to maximize read/write throughput during product browsing while safely rejecting conflicting concurrent checkout attempts.",
      "Eager vs. Lazy Fetching in JPA: Utilized strictly explicit JOIN FETCH queries and DTO projections for complex multi-table reads (order histories with nested line items) to eliminate the N+1 query problem without runtime lazy initialization exceptions."
    ],
    architecture: [
      "Spring Boot REST Controller Layer with Validation",
      "Spring Security Custom Filter Chain & JWT Authenticator",
      "OAuth2 Authorization Provider (Google / GitHub login flow)",
      "Transactional Service Layer with Business Rule Enforcement",
      "Hibernate / JPA Data Layer with Normalized PostgreSQL Schemas",
      "Centralized Global Exception & API Error Response Contract"
    ],
    features: [
      "Stateless JWT authentication with refresh token lifecycle and OAuth2 social login integration",
      "Three-tier Role-Based Access Control (Customer, Merchant/Seller, Administrator) with method-level authorization",
      "Hierarchical product catalog with multi-attribute filtering and indexed search",
      "Real-time cart validation with price verification and inventory stock checks",
      "ACID-compliant order placement workflow with transactional rollback on inventory failure",
      "Administrative APIs for inventory re-stocking, order status transitions, and user management",
      "Normalized PostgreSQL data model with explicit referential integrity and foreign key constraints"
    ],
    challenges: "Handling concurrent cart checkout while maintaining absolute inventory accuracy was critical. Solving the N+1 query problem across nested order histories required replacing generic repository queries with custom JPQL queries using explicit JOIN FETCH clauses and projection DTOs, reducing database query roundtrips by 75%.",
    future: [
      "Integrate Redis caching for product catalog read-heavy queries and category trees",
      "Integrate asynchronous payment webhook processing (Stripe / Razorpay)",
      "Introduce Kafka event-driven order processing to decouple email notifications and inventory services"
    ]
  },
  "goalflow": {
    id: "goalflow",
    title: "GoalFlow — Enterprise Goal Management",
    eyebrow: "Full-Stack / Spring Boot & AI",
    subtitle: "Enterprise goal tracking platform with role-based team management, progress analytics, and AI-assisted milestone suggestions built on Spring Boot REST APIs.",
    github: "https://github.com/sharmaVishal2/GoalFlow",
    live: null,
    stack: ["Java", "Spring Boot", "PostgreSQL", "Spring Security", "REST APIs", "AI Integration"],
    overview: "An enterprise-grade goal setting and tracking system that enables teams to set hierarchical OKRs/goals, track real-time completion analytics, and receive intelligent milestone decomposition suggestions."
  },
  "algopush": {
    id: "algopush",
    title: "AlgoPush — AI LeetCode GitHub Sync",
    eyebrow: "Productivity / AI & Browser Extension",
    subtitle: "Automated Chrome extension that synchronizes accepted LeetCode solutions directly to organized GitHub repositories with AI-generated complexity analysis.",
    github: "https://github.com/sharmaVishal2/AlgoPush",
    live: null,
    stack: ["JavaScript", "Chrome Extension API", "GitHub REST API", "Groq LLaMA 3", "AI Explanations"],
    overview: "A developer tool that captures accepted LeetCode submissions in real time, generates markdown documentation with time/space complexity analysis using LLM APIs, and automatically commits solutions to organized GitHub repositories."
  },
  "smarthire": {
    id: "smarthire",
    title: "SmartHire — AI Career Assistant",
    eyebrow: "Hackathon Project / AI & Spring Boot",
    subtitle: "AI-powered career assistant built with Spring Boot, React, and Groq LLaMA 3 API for real-time resume optimization and tailored cover letter generation.",
    github: "https://github.com/sharmaVishal2/SmartHire",
    live: null,
    stack: ["Spring Boot", "React", "Groq API", "LLaMA 3", "REST APIs", "Tailwind CSS"],
    overview: "Developed during an MLH Hackathon, SmartHire analyzes job descriptions and candidate profiles to generate context-aware resume bullet suggestions and customized cover letters in sub-second inference times using Groq's high-speed LLaMA 3 engine."
  }
};
