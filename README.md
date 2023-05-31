# IQKIDS Application on Kubernetes

This is a Node.js application called IQKIDS, which is deployed on Kubernetes using Docker. IQKIDS is a kids' app that engages children with unique quizzes, stores their scores, and displays areas where they can improve. It also includes an inbuilt calculator. Users can delete and update their profiles once they are logged in.

## Prerequisites

- Docker installed on your local machine
- Kubernetes installed on your local machine
- Google Cloud Platform account

## Getting Started

Clone the repository to your local machine:

```bash
git clone https://github.com/Navinraaj/sit737-2023-t1-prac7p
```

## Build the Docker image

```bash
docker build -t myimage:v1 .
```

## Push the Docker image to a Docker registry

```bash
docker tag myimage:v1 gcr.io/[PROJECT_ID]/myimage:v1
docker push gcr.io/[PROJECT_ID]/myimage:v1
```

## Deploy the Kubernetes configuration

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Verify that the application is running

```bash
kubectl get pods
kubectl get services
```

## Access the application from Google Cloud

1. Open the Google Cloud Console and navigate to the Kubernetes Engine section.
2. Select your project and cluster.
3. Go to the Workloads tab and click on the deployed workload.
4. In the Workload details view, click on the Service link.
5. Access the application in a web browser using the external IP or domain associated with the service.

## Automatic CI/CD with Google Cloud Build

Google Cloud Build can be set up to automatically build and deploy the application whenever changes are pushed to the Git repository. Follow these steps to enable automatic CI/CD:

1. Set up a Google Cloud Build trigger by connecting your Git repository.
2. Configure the trigger to build and push the Docker image whenever changes are pushed to the repository.
3. Configure the trigger to deploy the updated image to your Kubernetes cluster.

## Updating the Application

To update the application, modify the code for the Node.js application, commit the changes, and push them to the Git repository. Google Cloud Build will automatically build and deploy the updated image to your Kubernetes cluster.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
