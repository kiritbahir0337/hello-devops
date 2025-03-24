import { useState } from 'react'
import './App.css'

function App() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [deploymentDetails, setDeploymentDetails] = useState(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleDeploy = async () => {
    setIsDeploying(true)
    
    try {
      // Get initial deployment message
      const startResponse = await fetch(`${backendUrl}/start-deployment`)
      const startData = await startResponse.json()
      setDeploymentDetails(startData)
      setDeploymentStatus(startData.status)

      // Simulate deployment steps with backend messages
      for (const step of startData.steps) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setDeploymentStatus(step)
      }

      // Get success message
      const successResponse = await fetch(`${backendUrl}/deployment-success`)
      const successData = await successResponse.json()
      setDeploymentDetails(successData)
      setDeploymentStatus(successData.message)
    } catch (error) {
      console.error('Deployment error:', error)
      setDeploymentStatus('❌ Error during deployment')
      setDeploymentDetails({
        message: 'Deployment Failed',
        details: 'There was an error connecting to the backend service.'
      })
    }

    setIsDeploying(false)
  }

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="nav-brand">DevOps Automation</div>
        <div className="nav-links">
          <a href="#" className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</a>
          <a href="#" className={activeTab === 'features' ? 'active' : ''} onClick={() => setActiveTab('features')}>Features</a>
          <a href="#" className={activeTab === 'demo' ? 'active' : ''} onClick={() => setActiveTab('demo')}>Live Demo</a>
          <a href="#" className={activeTab === 'docs' ? 'active' : ''} onClick={() => setActiveTab('docs')}>Documentation</a>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1>Infrastructure as Code</h1>
          <p className="hero-subtitle">Automate your entire infrastructure deployment with a single click</p>
          <button className="cta-button" onClick={() => setActiveTab('demo')}>Try Live Demo</button>
        </div>
        <div className="hero-visual">
          <div className="code-preview">
            <pre>
              <code>
                terraform apply -auto-approve
                ↳ AWS infrastructure provisioned
                ↳ Docker containers deployed
                ↳ Application running
              </code>
            </pre>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="feature-cards">
          <div className="feature-card premium">
            <div className="card-icon">🚀</div>
            <h3>One-Click Deploy</h3>
            <p>Deploy your entire stack with a single command. Includes EC2, security groups, and containerized applications.</p>
            <ul className="feature-list">
              <li>Automated AWS Setup</li>
              <li>Docker Integration</li>
              <li>Security Best Practices</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="card-icon">🔒</div>
            <h3>Security First</h3>
            <p>Enterprise-grade security with automated configurations and best practices built-in.</p>
          </div>

          <div className="feature-card">
            <div className="card-icon">🔄</div>
            <h3>Container Orchestration</h3>
            <p>Automated Docker container deployment and networking with zero manual configuration.</p>
          </div>

          <div className="feature-card">
            <div className="card-icon">⚡</div>
            <h3>High Performance</h3>
            <p>Optimized infrastructure settings for maximum efficiency and scalability.</p>
          </div>
        </div>

        <div className="demo-section">
          <h2>Live Deployment Demo</h2>
          <div className="demo-container">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-button red"></span>
                <span className="terminal-button yellow"></span>
                <span className="terminal-button green"></span>
              </div>
              <div className="terminal-content">
                {deploymentDetails?.greeting && (
                  <div className="greeting-message">
                    {deploymentDetails.greeting}
                  </div>
                )}
                <button 
                  className={`deploy-button ${isDeploying ? 'deploying' : ''}`}
                  onClick={handleDeploy}
                  disabled={isDeploying}
                >
                  {isDeploying ? 'Deploying...' : '$ Start Deployment'}
                </button>
                {deploymentStatus && (
                  <div className="status-container">
                    <p className="status-text">{deploymentStatus}</p>
                    {deploymentDetails?.details && (
                      <p className="details-text">{deploymentDetails.details}</p>
                    )}
                    {deploymentDetails?.next_steps && (
                      <ul className="next-steps">
                        {deploymentDetails.next_steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <h2>Powered By Industry Leaders</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <span className="tech-icon">⚙️</span>
              <span>Terraform</span>
              <span className="tech-desc">Infrastructure as Code</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">🐳</span>
              <span>Docker</span>
              <span className="tech-desc">Container Platform</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">☁️</span>
              <span>AWS</span>
              <span className="tech-desc">Cloud Infrastructure</span>
            </div>
            <div className="tech-item">
              <span className="tech-icon">⚛️</span>
              <span>React</span>
              <span className="tech-desc">Frontend Framework</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DevOps Automation</h3>
            <p>Empowering businesses with cutting-edge automation solutions</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>info@devopsautomation.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

