pipeline {
    agent any

    environment {
        DOCKER_IMAGE_FRONTEND = 'kiritahir/hello-devops-frontend:latest'
        DOCKER_IMAGE_BACKEND = 'kiritahir/hello-devops-backend:latest'
        TERRAFORM_DIR = './terraform'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'GITHUB_PAT', variable: 'GITHUB_PAT')]) {
                        sh "git clone https://${GITHUB_PAT}@github.com/kiritbahir0337/hello-devops.git"
                    }
                }
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
                    withCredentials([
                        string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        sh """
                        export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                        export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                        cd ${TERRAFORM_DIR} 
                        terraform init
                        terraform plan
                        terraform apply -auto-approve
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successfully completed!'
        }
        failure {
            echo '❌ Something went wrong. Check the logs for errors.'
        }
    }
}

