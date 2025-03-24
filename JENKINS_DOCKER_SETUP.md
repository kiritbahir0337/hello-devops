# Jenkins Docker Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- AWS CLI configured
- Terraform installed
- GitHub repository with admin access

## 1. Initial Setup

### Create Jenkins Docker Compose Configuration
1. Create a `docker-compose.yml` file with the following content:
```yaml
version: "3.8"

services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JENKINS_OPTS="--prefix=/jenkins"
    restart: unless-stopped

volumes:
  jenkins_home:
```

### Start Jenkins
1. Start Jenkins container:
```bash
docker-compose up -d jenkins
```

2. Get initial admin password:
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

3. Access Jenkins at `http://localhost:8080/jenkins`

### Install Required Plugins
1. Install the following plugins:
   - Docker Pipeline
   - AWS Credentials
   - Git
   - Pipeline: GitHub
   - Blue Ocean
   - GitHub Integration
   - GitHub Pull Request Builder

## 2. Jenkins Configuration

### Configure GitHub Integration
1. Go to Manage Jenkins > Configure System
2. Find the GitHub section
3. Add GitHub server:
   - Name: GitHub
   - API URL: https://api.github.com
   - Credentials: Add GitHub credentials (Personal Access Token)
4. Click "Test connection" to verify

### Configure GitHub Webhook
1. Go to your GitHub repository
2. Navigate to Settings > Webhooks
3. Click "Add webhook"
4. Configure webhook:
   - Payload URL: `http://your-jenkins-server:8080/jenkins/github-webhook/`
   - Content type: `application/json`
   - Secret: (leave empty for now)
   - Events: Select "Just the push event"
   - Branch filter: `main`
5. Click "Add webhook"

### Configure Credentials
1. Go to Manage Jenkins > Manage Credentials
2. Add the following credentials:
   - Docker Hub credentials (Username with password)
   - AWS credentials (Access key and secret key)
   - GitHub credentials (Personal Access Token)

### Configure Global Tools
1. Go to Manage Jenkins > Global Tool Configuration
2. Configure:
   - Docker installation
   - Node.js installation
   - Python installation
   - Git installation

### Configure Pipeline
1. Create a new Pipeline job
2. Configure Git repository
3. Set pipeline script from SCM
4. Select Git as SCM
5. Enter repository URL
6. Set branch specifier to `*/main`
7. Enable "Build when a change is pushed to GitHub"

## 3. Pipeline Flow

The pipeline will execute the following stages when code is pushed to the main branch:

1. **Checkout**: Clones the repository
2. **Build and Push Docker Images**: 
   - Builds frontend and backend Docker images
   - Pushes images to Docker Hub
3. **Deploy Infrastructure**:
   - Initializes Terraform
   - Plans and applies infrastructure changes
4. **Deploy Application**:
   - Updates docker-compose.yml with new versions
   - Deploys using docker-compose

## 4. Maintenance

### Backup Jenkins Data
```bash
# Backup Jenkins home directory
docker run --rm --volumes-from jenkins -v $(pwd):/backup ubuntu tar cvf /backup/jenkins-backup.tar /var/jenkins_home
```

### Restore Jenkins Data
```bash
# Stop Jenkins
docker-compose stop jenkins

# Restore backup
docker run --rm --volumes-from jenkins -v $(pwd):/backup ubuntu bash -c "cd /var/jenkins_home && tar xvf /backup/jenkins-backup.tar --strip 1"

# Start Jenkins
docker-compose start jenkins
```

### Update Jenkins
```bash
# Pull latest Jenkins image
docker pull jenkins/jenkins:lts

# Restart Jenkins container
docker-compose restart jenkins
```

## 5. Troubleshooting

### Common Issues

1. **Jenkins container won't start**
   - Check Docker logs: `docker logs jenkins`
   - Verify port availability
   - Check Docker socket permissions

2. **Pipeline fails to start**
   - Check Jenkins service status
   - Verify Git repository access
   - Check pipeline syntax
   - Verify GitHub webhook configuration

3. **Docker build fails**
   - Verify Docker service is running
   - Check Docker credentials
   - Ensure sufficient disk space

4. **Terraform deployment fails**
   - Verify AWS credentials
   - Check Terraform state
   - Validate infrastructure configuration

### Logs and Debugging
1. View Jenkins logs:
```bash
docker logs -f jenkins
```

2. View pipeline logs:
   - Access Blue Ocean interface
   - Check console output
   - Review stage logs

3. Check GitHub webhook logs:
   - Go to GitHub repository > Settings > Webhooks
   - Click on the webhook
   - View recent deliveries

## 6. Security Considerations

1. **Docker Security**
   - Use specific versions for Docker images
   - Regularly update Jenkins image
   - Secure Docker socket access

2. **Jenkins Security**
   - Enable authentication
   - Use role-based access control
   - Regular security updates

3. **Network Security**
   - Configure firewall rules
   - Use HTTPS
   - Restrict Jenkins access to specific IPs

4. **Credentials Management**
   - Use Jenkins credentials store
   - Rotate credentials regularly
   - Use environment variables for sensitive data 