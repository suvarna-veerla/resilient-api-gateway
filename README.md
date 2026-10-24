# Resilient API Gateway for SAP OData Services

A web-based API Gateway prototype designed to demonstrate resilient request handling for SAP S/4HANA OData services. The project includes a React dashboard and a Spring Boot backend with rate limiting and circuit breaker mechanisms.

## Live Demo

**Application:** https://resilient-api-gateway-ps3s.onrender.com/

> Note: The live service may take a little time to start if it has been idle.

## Project Overview

This project demonstrates how an API gateway can manage incoming requests, simulate SAP OData responses, and handle failures to improve service reliability.

The dashboard allows users to send requests and simulate failures to observe the gateway's behavior.

## Key Features

- **Rate Limiting:** Limits repeated requests to help control incoming traffic.
- **Circuit Breaker:** Demonstrates CLOSED, OPEN, and HALF_OPEN states to manage simulated service failures.
- **Request Monitoring:** Displays gateway responses and request activity through a dashboard.
- **SAP OData Simulation:** Returns sample sales order payloads inspired by SAP OData service responses.
- **REST API Integration:** Connects a React frontend to a Spring Boot backend.
- **Docker Support:** Includes containerization support for deployment.

## Technology Stack

- **Frontend:** React, Vite, JavaScript
- **Backend:** Java, Spring Boot
- **API:** REST, SAP OData service simulation
- **Resilience:** Rate limiting, circuit breaker
- **Deployment:** Docker, Render
- **Version Control:** Git, GitHub

## Architecture

1. The user sends a request through the React dashboard.
2. The Spring Boot backend receives and processes the request.
3. The rate limiter checks whether the request can proceed.
4. The circuit breaker manages simulated service failures.
5. The backend returns a response that the dashboard can display.

## Run Locally

### Prerequisites

- Node.js and npm
- Java 17 or a compatible JDK
- Maven

### Frontend

```bash
npm install
npm run dev
```

### Backend

Run the Spring Boot application from the backend project directory using Maven:

```bash
mvn spring-boot:run
```

The backend is configured to use port `8082` by default.

## Project Repositories

- **Frontend:** https://github.com/suvarna-veerla/resilient-api-gateway
- **Backend:** https://github.com/suvarna-veerla/sap-api-gateway-backend

## Disclaimer

This is a demonstration project. The SAP OData responses are simulated; a live SAP S/4HANA system is not connected unless separately configured.
