# Event Exchange

Event Exchange is an e-commerce platform that allows users to buy and sell tickets to specific events. This project is built with a microservices architecture using Next.js, Express.js, TypeScript, and NATS JetStream. It emphasizes minimal dependencies to simplify debugging and enhance code readability.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Philosophy](#philosophy)
- [Microservices](#microservices)
  - [Auth Service](#auth-service)
  - [Items Service](#items-service)
  - [Common Module](#common-module)
  - [Client Service](#client-service)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)
- [License](#license)

## Architecture Overview

![Architecture Diagram](./diagrams/architecture-diagram.png)

The application consists of several microservices communicating through NATS JetStream, ensuring decoupled and efficient message passing. Each service is independently deployable and scalable, running in Docker containers orchestrated by Kubernetes.

## Philosophy

The core philosophy of Event Exchange is the **use of minimal dependencies**. By relying less on external libraries, the codebase becomes more transparent and easier to debug. If an issue arises, you can read the code directly instead of navigating through extensive third-party documentation. This approach leads to cleaner, more maintainable code and a deeper understanding of the application's inner workings.

## Microservices

### Auth Service

**Features:**

- **User Authentication:**
  - Signup
  - Signin
  - Signout
- **Password Reset:**
  - Via email
- **Security:**
  - Stateless authentication using JSON Web Tokens (JWT)
- **Data Storage:**
  - MongoDB for user persistence
- **Testing:**
  - Implemented with Jest for unit and integration tests

**Technologies:**

- Express.js
- TypeScript
- MongoDB
- JWT
- Jest

### Items Service

**Features:**

- **Ticket Management:**
  - Create, read, update, delete (CRUD) operations on tickets
- **Authentication:**
  - Ensures operations are performed by authenticated users
- **Authorization:**
  - Users can only modify their own tickets

**Technologies:**

- Express.js
- TypeScript
- MongoDB
- JWT

### Common Module

**Features:**

- **Shared Codebase:**
  - Middlewares
  - Utility functions
- **Smart Error Handling:**
  - Centralized error handling across services
- **Documentation:**
  - Explained in detail in [this YouTube video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

### Client Service

**Features:**

- **User Interface:**
  - Interactive UI for buying and selling tickets
- **Design:**
  - Responsive design with Tailwind CSS
- **Components:**
  - Built with Shadcn UI components

**Technologies:**

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Shadcn
- **Backend:** Express.js, TypeScript, MongoDB
- **Messaging:** NATS JetStream
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Development Tools:** Skaffold, Ingress-nginx

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Docker**
- **Kubernetes** (Minikube or Docker Desktop with Kubernetes enabled)
- **Skaffold**
- **Ingress-nginx** for routing

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mmaksi/event-exchange.git
   cd event-exchange
   ```
2. **Set Up Kubernetes Cluster:**
Ensure Docker and Kubernetes are running on your machine.

3. **Install Ingress-Nginx Controller:**
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml

4. **Update Hosts File:**
127.0.0.1 eventexchange.online

5. **Configure Environment Variables:**
No need to create local `.env` files. Go to each deployment file in the infra/k8s directory, and change the environment variables.

6. **Deploy with Skaffold:**
Ensure Skaffold is installed, and run `skaffold dev`

7. **Access the Application:**
Visit `http://eventexchange.online` in your browser.

## 🧪 Testing

- Unit and Integration Tests:
  Navigate to the service directory and run:

```bash
npm test
```

