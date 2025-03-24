# Jenkins CI/CD Setup Guide

## Prerequisites
- Jenkins server (Ubuntu 22.04 LTS recommended)
- Docker and Docker Compose installed
- AWS CLI configured
- Terraform installed
- Node.js and Python installed
- Git installed
- GitHub repository with admin access

## 1. Jenkins Installation

### Install Jenkins on Ubuntu
```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Update package list
sudo apt-get update

# Install Jenkins
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Initial Jenkins Setup
1. Access Jenkins at `http://your-server:8080`
2. Get initial admin password:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Install recommended plugins:
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
   - Payload URL: `http://your-jenkins-server:8080/github-webhook/`
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

## 3. Pipeline Stages

The pipeline consists of the following stages:

1. **Checkout**: Clones the repository
2. **Build Frontend**: 
   - Installs dependencies
   - Builds the application
   - Creates and pushes Docker image
3. **Build Backend**:
   - Creates and pushes Docker image
4. **Test**:
   - Runs backend tests
   - Runs frontend tests
5. **Deploy Infrastructure**:
   - Initializes Terraform
   - Plans and applies infrastructure changes
6. **Deploy Application**:
   - Updates docker-compose.yml with new versions
   - Deploys using docker-compose

## 4. Monitoring and Maintenance

### Jenkins Performance Monitoring
1. Install Monitoring plugins:
   - Monitoring
   - Prometheus metrics
   - Build Timeout

### Backup and Recovery
1. Configure Jenkins backup:
   ```bash
   # Backup Jenkins home directory
   sudo tar -czf jenkins-backup.tar.gz /var/lib/jenkins/
   ```

2. Restore from backup:
   ```bash
   # Stop Jenkins
   sudo systemctl stop jenkins
   
   # Restore backup
   sudo tar -xzf jenkins-backup.tar.gz -C /
   
   # Start Jenkins
   sudo systemctl start jenkins
   ```

## 5. Security Best Practices

1. Configure Jenkins security:
   - Enable authentication
   - Use role-based access control
   - Regular security updates

2. Secure credentials:
   - Use Jenkins credentials store
   - Rotate credentials regularly
   - Use environment variables for sensitive data

3. Network security:
   - Configure firewall rules
   - Use HTTPS
   - Restrict Jenkins access to specific IPs

## 6. Troubleshooting

### Common Issues

1. **Pipeline fails to start**
   - Check Jenkins service status
   - Verify Git repository access
   - Check pipeline syntax
   - Verify GitHub webhook configuration

2. **Docker build fails**
   - Verify Docker service is running
   - Check Docker credentials
   - Ensure sufficient disk space

3. **Terraform deployment fails**
   - Verify AWS credentials
   - Check Terraform state
   - Validate infrastructure configuration

### Logs and Debugging
1. View Jenkins logs:
   ```bash
   sudo tail -f /var/log/jenkins/jenkins.log
   ```

2. View pipeline logs:
   - Access Blue Ocean interface
   - Check console output
   - Review stage logs

3. Check GitHub webhook logs:
   - Go to GitHub repository > Settings > Webhooks
   - Click on the webhook
   - View recent deliveries

## 7. Maintenance Tasks

### Regular Maintenance
1. Update Jenkins and plugins
2. Clean up workspace
3. Monitor disk space
4. Review and rotate credentials
5. Check pipeline performance
6. Verify GitHub webhook status

### Backup Schedule
- Daily: Configuration backup
- Weekly: Full system backup
- Monthly: Archive old builds 