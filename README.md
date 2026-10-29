# Resilient OData Proxy Gateway Engine for SAP S/4HANA Cloud ERP

A Java Spring Boot project that demonstrates resilient API request handling for SAP-style OData services using rate limiting and circuit-breaker patterns.

The project includes a backend gateway and a monitoring dashboard designed to demonstrate request handling, simulated service failures, and gateway behavior.

## Project Overview

Enterprise applications depend on APIs to exchange business data. Excessive requests or service failures can affect reliability and availability.

This project demonstrates how an API gateway can control incoming traffic and handle simulated service failures using common resilience patterns.

**Project status:** Academic/personal project with simulated SAP OData responses. A live SAP S/4HANA connection is not claimed.

## Key Features

- **Rate Limiting:** Token-bucket-based request control using client IP addresses.
- **Circuit Breaker:** Demonstrates CLOSED, OPEN, and HALF_OPEN states.
- **Failure Simulation:** Simulates service failures to observe circuit-breaker behavior.
- **OData-Style Endpoint:** Exposes a SAP-style sales-order endpoint with sample business data.
- **Monitoring Dashboard:** A React interface for sending requests and observing traffic metrics.
- **Containerization:** Docker-based backend packaging.
- **Cloud Deployment:** Backend deployed on Render.

## Technology Stack

| Component | Technologies |
|---|---|
| Backend | Java, Spring Boot |
| API | REST, OData-style endpoint |
| Resilience | Token Bucket, Circuit Breaker |
| Frontend | React, JavaScript |
| Deployment | Docker, Render |
| Build Tool | Maven |

## Architecture

```text
User
  |
  v
React Monitoring Dashboard
  |
  v
Spring Boot API Gateway
  |
  +--> Rate Limiter
  |
  +--> Circuit Breaker
  |
  v
Simulated SAP OData Response
```

## API Endpoint

**Base endpoint:**

`/sap/opu/odata/sap/API_SALES_ORDER_SRV`

**Deployed backend:**

https://resilient-api-gateway-ps3s.onrender.com/

The endpoint returns simulated sales-order data, including fields such as sales order number, customer number, material number, net amount, and currency.

Note: The deployed root URL may not display the API response. Use the documented endpoint and its supported HTTP method when testing.

## Resilience Behavior

### Rate Limiting

The token-bucket implementation uses a maximum capacity of five tokens and a refill rate of one token every ten seconds. Requests may be limited when tokens are exhausted.

### Circuit Breaker

The gateway demonstrates three circuit states:

- **CLOSED:** Requests are allowed through the normal processing path.
- **OPEN:** Requests are rejected while the circuit is open.
- **HALF_OPEN:** After the cooldown period, the implementation allows recovery behavior to be evaluated.

The current implementation uses a five-second cooldown.

## Running Locally

### Prerequisites

- Java Development Kit (JDK)
- Maven
- Git

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/suvarna-veerla/sap-api-gateway-backend.git
   ```

2. Open the cloned project directory:

   ```bash
   cd sap-api-gateway-backend
   ```

3. Build the project:

   ```bash
   mvn clean package
   ```

4. Run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

5. Test the gateway using its configured endpoint:

   ```text
   http://localhost:8082/sap/opu/odata/sap/API_SALES_ORDER_SRV
   ```

Use the HTTP method and request format supported by the controller.

## Learning Outcomes

- Implementing REST APIs using Spring Boot.
- Understanding token-bucket rate limiting.
- Learning circuit-breaker state transitions.
- Simulating API failures and examining gateway behavior.
- Packaging a backend application with Docker.
- Deploying a Java backend to a cloud platform.

## Future Enhancements

- Add automated unit and integration tests.
- Improve structured logging and monitoring.
- Add configurable rate limits and circuit-breaker settings.
- Integrate with a real SAP S/4HANA environment using appropriate credentials and connectivity.
- Add API documentation and request-validation tests.

## Author

**Suvarna Veerla**

GitHub: https://github.com/suvarna-veerla
