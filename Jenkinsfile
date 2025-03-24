pipeline {
    agent any

    environment {
        DOCKER_IMAGE_FRONTEND = 'kiritahir/hello-devops-frontend:latest'  // Replace with your Docker Hub username
        DOCKER_IMAGE_BACKEND = 'kiritahir/hello-devops-backend:latest'    // Replace with your Docker Hub username
        DOCKER_REGISTRY = 'https://hub.docker.com/' // Docker Hub registry URL
        TERRAFORM_DIR = './terraform' // Path to your Terraform directory
        GIT_REPO_URL = 'https://github.com/yourusername/hello-devops.git'  // Replace with your Git repository URL
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Clone the Git repository
                git branch: 'main', url: "${GIT_REPO_URL}"
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh 'docker build --platform linux/amd64 -t ${DOCKER_IMAGE_FRONTEND} -f frontend/Dockerfile ./frontend'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh 'docker build --platform linux/amd64 -t ${DOCKER_IMAGE_BACKEND} -f backend/Dockerfile ./backend'
                }
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}"
                    sh "docker push ${DOCKER_IMAGE_BACKEND}"
                }
            }
        }

        stage('Deploy with Terraform') {
            steps {
                script {
                    // Correct way to use AWS credentials
                    withCredentials([
                        string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        sh """
                        export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                        cd ${TERRAFORM_DIR} && terraform init
                        cd ${TERRAFORM_DIR} && terraform plan
                        cd ${TERRAFORM_DIR} && terraform apply -auto-approve
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successfully completed!'
        }
        failure {
            echo 'Something went wrong. Check the logs for errors.'
        }
    }
}

