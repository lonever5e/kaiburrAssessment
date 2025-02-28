# Task4: CI/CD Pipeline for the Task UI Application

This project implements a CI/CD pipeline for the Task UI application (originally Task3) using GitHub Actions. The pipeline automates the process of building the application, creating a Docker image, and (optionally) pushing the image to a Docker registry. This README explains how to set up, trigger, and monitor the pipeline.

---

## Overview

The CI/CD pipeline is implemented using GitHub Actions and is defined in the workflow file located at:
```
.github/workflows/ci-cd.yml
```
The pipeline includes the following steps:
- **Checkout the Repository:** Retrieves the latest code.
- **Set Up Node.js Environment:** Uses Node.js v18.
- **Install Dependencies & Build Application:** Runs `npm install` and `npm run build` in the Task UI application folder.
- **Docker Build:** Builds a Docker image for the application.
- **(Optional) Docker Push:** If Docker Hub credentials are configured, pushes the image to Docker Hub.

The pipeline is triggered on pushes or pull requests that affect the files in the Task4 directory (or other paths as configured).

---

## Prerequisites

- **Node.js** (v18 or later)
- **Docker**
- **GitHub Account** with a repository containing your project
- **GitHub Secrets** (if you plan to push Docker images):  
  - `DOCKERHUB_USERNAME`
  - `DOCKERHUB_TOKEN` (ensure this token has the necessary scopes, including `workflow`)

---

## Setup Instructions

### 1. Configure the Workflow File

Ensure the following file exists in your repository (at the root):
```
.github/workflows/ci-cd.yml
```

---

### 2. Commit and Push Your Changes

From your repository root, run:

```bash
git add .github/workflows/ci-cd.yml
git commit -m "Add CI/CD pipeline for Task4 (Task UI application)"
git push origin main
```

This will trigger the GitHub Actions workflow automatically on pushes or pull requests that affect the specified paths.

---

## How to Use the Pipeline

1. **Triggering the Pipeline:**  
   - Any push or pull request affecting files in the `Task4` directories will trigger the pipeline.
   - You can manually trigger the workflow using GitHub's Actions interface if needed.

2. **Monitoring the Pipeline:**  
   - Go to your GitHub repository and click on the **Actions** tab.
   - Select the "CI/CD Pipeline for Task4" workflow run to see detailed logs and the status of each step.
   - The logs will show the checkout, Node.js setup, dependency installation, build, Docker image build, and (if enabled) Docker push steps.

3. **Local Testing:**  
   - Before pushing, you can run the build commands locally from the Task UI application directory (`Task4`):
     ```bash
     cd Task4
     npm install
     npm run build
     docker build -t taskui:latest .
     ```
   - This helps ensure that the pipeline steps will succeed on GitHub Actions.

---

## Additional Notes

- **Image Names and Tags:**  
  The workflow builds a Docker image tagged as `taskui:latest`. Adjust the tag and repository name as needed.

- **GitHub Secrets:**  
  If you are not pushing the Docker image to an external registry, you can remove the Docker login and push steps from the workflow.

- **Trigger Paths:**  
  The workflow is configured to trigger on changes in `Task4/**` and optionally `Task3/**`. Adjust the paths if your structure changes.

- **CI/CD Benefits:**  
  This automated pipeline ensures that every code change is built, tested, and packaged consistently, reducing manual overhead and increasing reliability.

