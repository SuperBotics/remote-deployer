# Remote Deployment Utility

[![Build](https://github.com/SuperBotics/remote-deployer/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/SuperBotics/remote-deployer/actions/workflows/continuous-integration.yml)
![License](https://img.shields.io/badge/license-MIT-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-green)

Remote Deployment Utility is an open source service that runs on a remote machine and can be exposed through a Cloudflare tunnel. Developers can deploy release archives securely using authenticated API requests.

## Core Features
- API key protected deployment endpoint (`x-deployment-key`).
- Configurable idle shutdown (default: 8 hours) to reduce exposure windows.
- Strict deployment path boundary checks to prevent directory traversal.
- OpenAPI 3.0 + Swagger documentation at `/api-docs`.
- Security-focused response headers and safe structured logging.
- Container-ready stateless architecture.

## Folder Structure
```
.
├── src
│   ├── controllers
│   ├── data
│   ├── middleware
│   ├── models
│   ├── services
│   └── utils
├── tests
├── examples
│   ├── npm-script
│   ├── grunt
│   ├── webpack
│   └── github-actions
├── .github
│   ├── workflows
│   └── pull_request_template.md
├── docker-compose.yml
├── Dockerfile
└── CONTRIBUTING.md
```

## Setup
```bash
npm install
cp .env.example .env
npm start
```

## Environment Variables (`.env`)
- `PORT`: service port.
- `DEPLOYMENT_AUTHENTICATION_KEY`: required secret key for deploy requests.
- `DEPLOYMENTS_BASE_DIRECTORY`: absolute or relative safe deployment root.
- `MAXIMUM_UPLOAD_SIZE_IN_MEGABYTES`: request file size cap.
- `IDLE_SHUTDOWN_HOURS`: shutdown threshold for inactivity.
- `SAFE_LOGGING_ENABLED`: enable/disable safe structured logs.

## API and Swagger Documentation
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`
- Health endpoint: `GET /health`
- Deployment endpoint: `POST /deploy`

Example deployment request:
```bash
curl -X POST "http://localhost:3000/deploy" \
  -H "x-deployment-key: ${DEPLOYMENT_AUTHENTICATION_KEY}" \
  -F "path=my-application/current" \
  -F "file=@release.zip"
```

## Open Source Standards Included
- MIT License.
- Contributor guide (`CONTRIBUTING.md`).
- Pull request template (`.github/pull_request_template.md`).
- Continuous integration workflow for check and package validation.
- `.env.example` for secure configuration onboarding.

## Docker and Docker Compose
```bash
docker build -t remote-deployment-utility .
docker run --env-file .env -p 3000:3000 remote-deployment-utility
```

```bash
docker compose up --build
```

## Publish to npm
Update `name` and `version` in `package.json`, then:
```bash
npm run package-preview
npm publish --access public
```

## Automated Checks
```bash
npm run check
npm run package-preview
```

## Integration Examples
Detailed integration examples are available in [`examples/README.md`](examples/README.md):
- npm command based deployments.
- Grunt task deployments.
- Webpack post-build deployment hooks.
- GitHub Actions deployment workflow.

## Additional Recommended Roadmap Features
- Role-based deployment permissions and key rotation.
- Deployment audit history storage (external database or SIEM pipeline).
- Signed artifact verification before extraction.
- Canary deployment modes and automatic rollback.
- Webhook callbacks for deployment completion/failure.
- Optional policy engine for branch, environment, and artifact rules.

---

### Closing Note
Built with care for developer teams by people who value secure automation and practical operations.

Special thanks to **Superbotics and its team** for supporting innovation in modern developer tooling.
Learn more at [https://superbotics.com/](https://superbotics.com/).
