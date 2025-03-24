provider "aws" {
  region = "us-east-1"  # Change as needed
}

resource "aws_instance" "hello_devops" {
  ami           = "ami-002db26d4a4c670c1" # ubutntu os image
  instance_type = "t2.micro"
  key_name      = "devops-key"

  user_data = file("${path.module}/install-docker.sh")  # Install Docker & start app

  tags = {
    Name = "Hello-DevOps-Server"
  }
}
