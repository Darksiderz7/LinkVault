# LinkVault — Sprint 1 MVP

LinkVault is a full-stack bookmark manager that helps students, developers, and researchers save, organize, search, and manage useful websites in one dashboard.

## MVP Features

- Add links with a title, URL, category, and description
- View saved links in a responsive dashboard
- Search links by title, URL, or description
- Filter links by category through the API
- Delete saved links
- Validate URLs and prevent duplicates
- Health-check endpoint for deployment monitoring

Data is currently stored in memory and resets when the service restarts. Persistent storage, editing, and AI-assisted descriptions are planned for the next sprint.

## Technology Stack

- **Frontend:** HTML, CSS, and JavaScript
- **Backend:** Node.js and Express
- **Testing:** Node.js test runner
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Cloud:** Google Artifact Registry and Google Cloud Run
- **Planning:** Jira and Confluence

## Run Locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm start
```

Open <http://localhost:8080>.

## Run Tests

```bash
npm test
```

The automated test suite verifies service health, link creation, search, deletion, URL validation, and duplicate detection.

## Run with Docker

```bash
docker build -t linkvault .
docker run --rm -p 8080:8080 linkvault
```

Open <http://localhost:8080>.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/links` | Return all links |
| `GET` | `/api/links?search=term` | Search saved links |
| `GET` | `/api/links?category=name` | Filter by category |
| `POST` | `/api/links` | Save a new link |
| `DELETE` | `/api/links/:id` | Delete a link |
| `GET` | `/api/health` | Report service health |

## CI/CD and Cloud Deployment

The GitHub Actions workflow runs tests for every pull request and push to `main`. After tests pass on `main`, it builds a Docker image, pushes it to Google Artifact Registry, and deploys LinkVault to Google Cloud Run. Deployment uses encrypted repository secrets: `GCP_PROJECT_ID`, `GCP_REGION`, and `GCP_SA_KEY`.

## Professional Git Workflow

Sprint work is completed on a feature branch, submitted through a pull request, and merged into `main` after automated tests pass. Commit messages describe each completed unit of work.

## AI Tool Usage

AI tools were used to brainstorm the MVP layout, explain errors, suggest test cases, review Docker and GitHub Actions configuration, and improve documentation. Suggestions were reviewed, adapted, and tested before inclusion. Final implementation and verification decisions were completed by the developer.

## Project Structure

```text
LinkVault/
├── .github/workflows/deploy.yml
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── test/app.test.js
├── Dockerfile
├── package.json
└── server.js
```

## Next Sprint

- Add persistent SQLite storage
- Add editing and advanced category filters
- Detect broken links
- Add AI-generated descriptions and category suggestions
- Expand automated test coverage
