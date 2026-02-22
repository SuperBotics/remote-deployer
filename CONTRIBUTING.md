# Contributing Guide

Thank you for contributing to Remote Deployment Utility.

## Development Setup
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and set values.
3. Install dependencies with `npm install`.
4. Start the service with `npm start`.

## Validation Before Pull Request
- Run `npm run check`.
- Run `npm run package-preview`.
- Ensure API documentation in `/api-docs` remains accurate.

## Branching
- Use `main` or `dev` as merge targets.
- Keep pull requests focused on one feature or fix.

## Security Requirements
- Validate and sanitize all request inputs.
- Never log secrets.
- Keep server stateless and container-ready.
