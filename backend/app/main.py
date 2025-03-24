from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, DevOps!"}

@app.get("/start-deployment")
def start_deployment():
    return {
        "greeting": "Welcome to DevOps Automation!",
        "status": "Starting deployment process...",
        "steps": [
            "Initializing AWS infrastructure",
            "Configuring security groups",
            "Setting up Docker environment",
            "Deploying containers"
        ]
    }

@app.get("/deployment-success")
def deployment_success():
    return {
        "message": "🎉 Deployment Successful!",
        "details": "Your infrastructure is ready. Containers are running and accessible.",
        "next_steps": [
            "Access your application at the provided URL",
            "Monitor resources in AWS Console",
            "Check container logs for details"
        ]
    }

