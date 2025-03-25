from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://54.89.143.93").split(",")

# Configure CORS with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "backend"}

@app.get("/")
def read_root():
    return {"message": "Hello, DevOps!"}

@app.get("/start-deployment")
async def start_deployment():
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/deployment-success")
async def deployment_success():
    try:
        return {
            "message": "🎉 Deployment Successful!",
            "details": "Your infrastructure is ready. Containers are running and accessible.",
            "next_steps": [
                "Access your application at the provided URL",
                "Monitor resources in AWS Console",
                "Check container logs for details"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

