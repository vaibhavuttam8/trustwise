# Text Analysis Dashboard

A full-stack application that analyzes text for toxicity and gibberish detection, featuring a React frontend and FastAPI backend.

## Project Structure

```
trustwise/
├── score-logger/        # Frontend React Application
├── backend/            # FastAPI Backend Service
├── app/               # Core Application Logic
└── docker-compose.yml # Docker Composition
```

## Features

- Real-time text analysis for toxicity and gibberish detection
- Interactive dashboard with graphs and history
- Dark/Light theme support
- Responsive design for all devices
- RESTful API endpoints
- Docker containerization

## Tech Stack

### Frontend (score-logger)
- React with TypeScript
- Material-UI (MUI) for UI components
- Recharts for data visualization
- Axios for API communication

### Backend (FastAPI)
- Python 3.8+
- FastAPI framework
- SQLAlchemy for database ORM
- ML libraries for text analysis
- PostgreSQL database

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Docker and Docker Compose
- MySQL

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trustwise
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Start the services using Docker:
```bash
docker-compose up -d
```

### Manual Setup (Development)

#### Frontend
```bash
cd score-logger
npm install
npm start
```

#### Backend
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API Endpoints

### Text Analysis
- `POST /api/analyze` - Analyze text for toxicity and gibberish
- `GET /api/analyses` - Retrieve analysis history

## Environment Variables

### Frontend
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENV` - Environment (development/production)

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Application secret key
- `ENVIRONMENT` - Runtime environment

## Development

### Running Tests
```bash
# Frontend
cd score-logger
npm test

# Backend
pytest
```

### Code Style
- Frontend: ESLint + Prettier
- Backend: Black + isort

## Docker Support

The application is containerized using Docker:

```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
