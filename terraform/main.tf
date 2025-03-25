provider "aws" {
  region = "us-east-1"  # Change as needed
}

resource "aws_instance" "hello_devops" {
  ami           = "ami-002db26d4a4c670c1" # ubutntu os image
  instance_type = "t2.micro"
  key_name      = "devops-key"
  vpc_security_group_ids = [aws_security_group.docker_sg.id]  # Attach SG

  user_data = <<-EOF
    #!/bin/bash
    set -x  # Enable debugging
    exec > >(tee /var/log/user-data.log) 2>&1
    
    # Update and install prerequisites
    apt-get update -y
    apt-get install -y git curl
    
    # Create ubuntu user directory if it doesn't exist
    mkdir -p /home/ubuntu
    chown ubuntu:ubuntu /home/ubuntu
    
    # Clone the repository as ubuntu user
    sudo -u ubuntu git clone https://github.com/kiritbahir0337/compose.git /home/ubuntu/compose || {
      echo "Failed to clone repository"
      exit 1
    }
    
    # Navigate to the directory
    cd /home/ubuntu/compose || {
      echo "Failed to change directory"
      exit 1
    }
    
    # Make the script executable and run it
    chmod +x auto.sh
    sudo ./auto.sh
    
    echo "User data script completed successfully at $(date)" >> /var/log/user-data.log
    EOF

  tags = {
    Name = "Hello-DevOps-Server"
  }
}

resource "aws_security_group" "docker_sg" {
  name        = "docker-app-sg"
  description = "Allow SSH, HTTP, and app ports"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}