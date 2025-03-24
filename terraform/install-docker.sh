#!/bin/bash

# Update & Install Dependencies
sudo apt update -y
sudo apt install -y docker.io docker-compose curl  # Ensure curl is installed
sudo docker --version
sudo docker-compose --version

# Start Docker Service
sudo systemctl start docker
sudo systemctl enable docker

# Allow Docker without sudo (for future logins)
sudo usermod -aG docker ubuntu
# The usermod change will take effect only after the next login, so using sudo for now
sudo newgrp docker

# Create app folder
mkdir -p ~/app && cd ~/app

# Wait for Docker to be fully ready (you can also use `docker info` instead)
sleep 10

# Create Docker Compose File
sudo cat <<EOF > docker-compose.yml
version: "3.8"

services:
  backend:
    image: kiritahir/hello-devops-backend:latest
    container_name: backend-container
    ports:
      - "8000:8000"
    restart: always
    networks:
      - app-network

  frontend:
    image: kiritahir/hello-devops-frontend:latest
    container_name: frontend-container
    environment:
      - VITE_BACKEND_URL=http://$(curl -s ifconfig.me):8000
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# Run Docker Compose (Using sudo as user changes won't apply immediately)
sudo docker-compose up -d

# Add a message about docker group
echo "NOTE: Docker group changes will take effect on the next login. For now, using sudo for docker commands."