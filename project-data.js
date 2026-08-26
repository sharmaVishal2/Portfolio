window.PORTFOLIO_PROJECTS = {
  "rate-limiter": {
    id: "rate-limiter",
    title: "Distributed Rate Limiter Service",
    eyebrow: "Backend / Distributed systems",
    subtitle: "Distributed service for regulating API traffic and protecting backend services from excessive requests.",
    image: "assets/project/distributed-rate-limiter-banner.svg",
    github: "https://github.com/sharmaVishal2/Distributed-Rate-Limiter",
    stack: ["Spring Boot", "Redis", "PostgreSQL", "Docker", "Spring Data JPA"],
    overview: "Developed a distributed rate limiting service using Spring Boot, Redis, and PostgreSQL to regulate API traffic and protect backend services from excessive requests.",
    architecture: ["Spring Boot", "Secure REST APIs for rate-limiting rules", "Redis atomic operations", "Thread-safe request counting across distributed instances", "PostgreSQL"],
    features: ["Implemented configurable Token Bucket and Sliding Window algorithms for efficient request throttling across multiple clients and API endpoints.", "Designed secure REST APIs to manage rate-limiting rules.", "Leveraged Redis atomic operations for thread-safe request counting across distributed instances."]
  },
  ecommerce: {
    id: "ecommerce",
    title: "E-Commerce Backend",
    eyebrow: "Backend / Security",
    subtitle: "Production-grade commerce API with OAuth2, JWT, role-based access control, and a fully normalized PostgreSQL data model.",
    image: "assets/project/ecommerce-banner.svg",
    github: "https://github.com/sharmaVishal2/E-Commerce-Application-by-Java-Spring-Boot",
    live: null,
    stack: ["Java", "Spring Boot", "Spring Security", "OAuth2", "JWT", "PostgreSQL", "Hibernate", "Maven"],
    overview: "A fully featured e-commerce backend built with Spring Boot that handles the complete product lifecycle — from catalog browsing and cart management to order placement and admin controls. The system enforces strict role-based access so customers, sellers, and admins each operate within clearly defined boundaries, backed by a normalized relational schema designed for consistency and query performance.",
    problem: "Building a commerce backend that feels simple to the frontend while hiding significant complexity underneath is hard. Most student projects skip proper security, use flat data models, or bolt on authentication as an afterthought. The goal here was to do it right from the start — secure by design, with a schema that reflects real domain relationships.",
    solution: "The system uses Spring Security with OAuth2 and JWT to handle authentication and authorization at the filter level, keeping business logic clean. Hibernate manages a normalized PostgreSQL schema with proper foreign keys, cascade rules, and indexed queries. Every endpoint is protected by role checks, and the API contract is consistent and predictable across all resources.",
    architecture: [
      "Spring Boot application layer",
      "Spring Security filter chain with JWT validation",
      "OAuth2 authorization flow",
      "Role-based access control (Customer / Seller / Admin)",
      "Hibernate ORM with normalized PostgreSQL schema",
      "RESTful resource controllers",
      "Service layer with transactional boundaries",
      "Maven build and dependency management"
    ],
    features: [
      "JWT-secured authentication with refresh token support",
      "OAuth2 integration for third-party login",
      "Three-tier RBAC: Customer, Seller, and Admin roles",
      "Product catalog with category hierarchy and search",
      "Cart management with quantity and price validation",
      "Order placement, tracking, and status management",
      "Admin dashboard APIs for inventory and user management",
      "Normalized PostgreSQL schema with referential integrity",
      "Hibernate-managed entity relationships and lazy loading",
      "Consistent REST API contract with proper HTTP semantics"
    ],
    screenshots: ["Product catalog API response", "Order management flow", "Admin inventory view"],
    challenges: "The most demanding part was designing the security layer so that role enforcement happened at the right level — not scattered across service methods but centralized in the filter chain and method-level annotations. Getting OAuth2 and JWT to coexist cleanly, with proper token validation and expiry handling, required careful configuration of the Spring Security filter order and token store.",
    future: [
      "Add Redis caching for product catalog and session tokens",
      "Introduce Elasticsearch for full-text product search",
      "Add payment gateway integration (Razorpay / Stripe)",
      "Build a seller analytics dashboard with revenue metrics",
      "Containerize with Docker and add CI/CD pipeline"
    ]
  }
};
