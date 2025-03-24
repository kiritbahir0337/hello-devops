#!/bin/bash
# Update system
sudo apt update -y

# Install Docker
sudo apt install -y docker.io

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker $USER
