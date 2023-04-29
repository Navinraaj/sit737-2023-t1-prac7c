# Node.js Application on Kubernetes

This is a simple Node.js application that is deployed on Kubernetes using Docker. This is a simple calculator application which uses JWT token for authentication.

# Prerequisites

    Docker installed on your local machine
    Kubernetes installed on your local machine

# Getting Started

    Clone the repository to your local machine.
    git clone https://github.com/Navinraaj/sit737-2023-t1-prac7p

# Build the Docker image.

    docker build -t myimage:v1 .

# Push the Docker image to a Docker registry.

    docker push myimage:v1

# Deploy the Kubernetes configuration.

    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml

# Verify that the application is running.

    kubectl get pods
    kubectl get services

# Use the kubectl port-forward command to forward traffic from a local port to the Kubernetes service.

    kubectl port-forward service/myapp 8080:80
    Access the application in a web browser by navigating to localhost:8080.

# Updating the Application

    To update the application, modify the code for the Node.js application, build a new Docker image with a new version tag, and update
    the Kubernetes deployment configuration to use the new image tag.

# Build the Docker image.

    docker build -t myimage:v2 .

# Push the Docker image to a Docker registry.

    docker push myimage:v2

# Update the Kubernetes deployment configuration.

    kubectl set image deployment/myapp myapp=myimage:v2

# Verify that the new version is running.

    kubectl get pods
    Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are welcome!

**License
This project is licensed under the MIT License - see the LICENSE file for details.**
