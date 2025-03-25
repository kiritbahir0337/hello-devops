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

    # Install Git
    sudo apt update -y
    sudo apt install -y git

    # Clone the repository containing auto.sh
    cd /home/ubuntu
    git clone https://github.com/kiritbahir0337/compose.git
    
    # Navigate to the directory containing auto.sh
    cd /home/ubuntu/compose
    
    # Make the script executable
    chmod +x auto.sh
    
    # Run the script
    ./auto.sh
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