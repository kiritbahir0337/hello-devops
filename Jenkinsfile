pipeline {
    agent any

    environment {
        DOCKER_IMAGE_FRONTEND = 'kiritahir/hello-devops-frontend:latest'
        DOCKER_IMAGE_BACKEND = 'kiritahir/hello-devops-backend:latest'
        TERRAFORM_DIR = './terraform'
    }

    parameters {
        booleanParam(name: 'DESTROY_INFRA', defaultValue: false, description: 'Check this to destroy infrastructure')
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'GITHUB_PAT', variable: 'GITHUB_PAT')]) {
                        sh '''
                            if [ -d "hello-devops/.git" ]; then
                                cd hello-devops && git reset --hard HEAD && git pull origin main
                            else
                                rm -rf hello-devops
                                git clone https://${GITHUB_PAT}@github.com/kiritbahir0337/hello-devops.git
                            fi
                        '''
                    }
                }
            }
        }

        stage('Build and Push Docker Images') {
            when {
                expression { return !params.DESTROY_INFRA }
            }
            steps {
                script {
                    sh '''
                        docker build --platform linux/amd64 -t ${DOCKER_IMAGE_FRONTEND} -f frontend/Dockerfile ./frontend
                        docker build --platform linux/amd64 -t ${DOCKER_IMAGE_BACKEND} -f backend/Dockerfile ./backend
                        docker push ${DOCKER_IMAGE_FRONTEND}
                        docker push ${DOCKER_IMAGE_BACKEND}
                    '''
                }
            }
        }

        stage('Terraform Init') {
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh 'terraform init'
                    }
                }
            }
        }

        stage('Deploy with Terraform') {
            when {
                expression { return !params.DESTROY_INFRA }
            }
            steps {
                script {
                    dir("${TERRAFORM_DIR}") {
                        sh '''
                            terraform plan
                            terraform apply -auto-approve
                        '''
                    }
                }
            }
        }

        stage('Destroy Infrastructure') {
            when {
                expression { return params.DESTROY_INFRA }
            }
            steps {
                script {
                    def adminApproval = input(
                        message: 'Are you sure you want to destroy the infrastructure?',
                        ok: 'Proceed',
                        parameters: [
                            string(name: 'APPROVED_BY', description: 'Enter your username for verification')
                        ]
                    )

                    // List of authorized admin users
                    def allowedUsers = ['admin', 'jenkins-admin']  // Replace with actual admin usernames
                    
                    if (!allowedUsers.contains(adminApproval)) {
                        error("❌ You are not authorized to destroy infrastructure!")
                    }

                    dir("${TERRAFORM_DIR}") {
                        sh 'terraform destroy -auto-approve'
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}

