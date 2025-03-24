# Hello DevOps Project

A complete DevOps project demonstrating a modern web application deployment using Docker, AWS, and Terraform. The project includes a frontend built with Vite, a backend API, and infrastructure as code for deployment.

## 🌟 Project Overview

This project is a full-stack application with the following components:
- Frontend: A modern web application built with Vite
- Backend: A Python-based API service
- Infrastructure: AWS deployment using Terraform
- Containerization: Docker and Docker Compose
- CI/CD: Automated deployment pipeline

## 🔄 Component Interaction & Workflow

### Frontend-Backend Communication
1. The frontend React application communicates with the backend through RESTful API endpoints
2. Key API endpoints:
   - `GET /`: Health check endpoint
   - `GET /start-deployment`: Initiates deployment process
   - `GET /deployment-success`: Confirms successful deployment
3. Real-time status updates and deployment progress tracking
4. CORS enabled for secure cross-origin communication

### Deployment Flow
1. User initiates deployment through the frontend interface
2. Frontend sends request to backend API
3. Backend processes the request and returns deployment status
4. Frontend displays real-time deployment progress
5. Upon completion, success message and next steps are shown

### Infrastructure Provisioning
1. Terraform manages AWS infrastructure:
   - EC2 instance creation
   - Security group configuration
   - Network setup
2. User data script installs required software:
   - Docker
   - Docker Compose
   - Git
3. Application deployment:
   - Clones repository
   - Builds and runs containers
   - Configures networking

## 🏗️ Architecture

The application follows a microservices architecture with:
- Frontend container running on port 80
- Backend API container running on port 8000
- Docker network for service communication
- AWS EC2 instance hosting both services

### Component Details

#### Frontend (React + Vite)
- Modern, responsive UI with real-time updates
- Features:
  - Interactive deployment dashboard
  - Live status updates
  - Terminal-like interface
  - Feature showcase
- Environment variables:
  - `VITE_BACKEND_URL`: Configurable backend API URL

#### Backend (FastAPI)
- RESTful API endpoints
- Features:
  - Deployment process management
  - Status tracking
  - Success confirmation
- Security:
  - CORS middleware
  - Input validation
  - Error handling

#### Infrastructure (Terraform + AWS)
- AWS Resources:
  - EC2 instance (t2.micro)
  - Security groups
  - Network configuration
- Terraform Features:
  - State management
  - Resource dependencies
  - User data scripts
  - Output variables

## 🛠️ Technology Stack

### Frontend
- Vite.js
- Node.js
- Docker container
- Nginx for serving static files

### Backend
- Python
- FastAPI (inferred from the setup)
- Docker container

### DevOps Tools
- Docker & Docker Compose
- Terraform for IaC
- AWS (EC2, Security Groups)
- Shell scripting

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- AWS CLI configured
- Terraform installed
- Git

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd hello-devops
```

2. Run locally using Docker Compose:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:80
- Backend: http://localhost:8000

### Production Deployment

1. Initialize Terraform:
```bash
cd terraform
terraform init
```

2. Deploy to AWS:
```bash
terraform plan
terraform apply
```

## 🏗️ Infrastructure Details

### AWS Resources
- EC2 Instance (t2.micro)
- Ubuntu AMI
- Security Group with ports:
  - 22 (SSH)
  - 80 (HTTP)
  - 8000 (Backend API)

### Security
- All necessary ports exposed through AWS Security Groups
- HTTPS ready (needs SSL certificate configuration)

## 🐳 Docker Configuration

### Frontend Container
- Base image: Node.js
- Build process: Multi-stage build
- Production: Nginx serving static files
- Environment variables:
  - VITE_BACKEND_URL: Backend API URL

### Backend Container
- Base image: Python
- Exposed port: 8000
- Auto-restart enabled

## 📁 Project Structure

```
hello-devops/
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── app/
│   │   └── main.py        # FastAPI application
│   └── Dockerfile
├── terraform/
│   ├── main.tf           # Main Terraform configuration
│   ├── variables.tf      # Variable definitions
│   ├── outputs.tf        # Output definitions
│   └── install-docker.sh # EC2 user data script
└── docker-compose.yml    # Local development setup
```

## 🔄 CI/CD Pipeline

The project includes automated deployment with:
- Docker images hosted on Docker Hub
- Automated EC2 instance setup
- Docker Compose for orchestration

## 🛡️ Security Considerations

1. AWS Security Groups properly configured
2. Docker network isolation
3. Environment variables for sensitive data
4. No hardcoded credentials

## 📝 Environment Variables

### Frontend
- `VITE_BACKEND_URL`: Backend API endpoint

### Backend
- Configure as needed for your application
