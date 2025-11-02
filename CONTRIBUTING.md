# Contributing to Trade Price Predictor

We love your input! We want to make contributing to Trade Price Predictor as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `develop`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the CHANGELOG.md with your changes
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
4. The PR will be merged once you have the sign-off of two other developers

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Report bugs using GitHub's [issue tracker](https://github.com/yourusername/trade_price_predictor/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/trade_price_predictor/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- Git
- Docker (optional)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trade_price_predictor.git
cd trade_price_predictor
```

2. Set up the backend:
```bash
cd tp_server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
```

3. Set up the frontend:
```bash
cd tp_client
npm install
```

4. Run tests:
```bash
# Backend tests
cd tp_server
pytest

# Frontend tests
cd tp_client
npm test
```

## Coding Standards

### Python (Backend)

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints where possible
- Write docstrings for all functions and classes
- Maximum line length: 100 characters
- Use Black for code formatting
- Use isort for import sorting

```bash
# Format code
black .
isort .

# Check code quality
flake8 .
mypy .
```

### TypeScript/JavaScript (Frontend)

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for all new code
- Use ESLint and Prettier for formatting
- Write JSDoc comments for public APIs

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

Example:
```
feat(api): add endpoint for real-time price updates

Implement WebSocket endpoint that streams real-time price updates
for selected stocks. Updates are throttled to max 1 per second.

Closes #123
```

## Testing

### Backend Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_forecast.py

# Run tests in parallel
pytest -n auto
```

### Frontend Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Documentation

- Update README.md for user-facing changes
- Update API documentation for endpoint changes
- Add JSDoc/docstrings for new functions
- Update CHANGELOG.md for all changes

## Code Review Process

All code must be reviewed before merging:

1. **Self-review**: Review your own code first
2. **Automated checks**: Ensure CI passes
3. **Peer review**: At least one approval required
4. **Maintainer review**: For significant changes

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Backwards compatibility maintained

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## Questions?

Feel free to contact the project maintainers if you have any questions.
