<h1>
  <img src="./docs/images/icon.png" width="50" align="left" style="margin-right: 10px;">
  AI Price Predictor
</h1>

<br clear="left"/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18.2+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)


A professional trading analytics platform that provides real-time market data, price predictions, and financial news aggregation.

## <img src="./docs/images/icon.png" width="24" align="top"> Features

- **Real-time Market Data**: Live stock prices and historical data via Yahoo Finance
- **Price Forecasting**: Advanced prediction algorithms for market trends
- **News Aggregation**: Real-time financial news from multiple sources
- **Interactive Charts**: Professional trading charts with technical indicators
- **WebSocket Support**: Real-time data streaming
- **Responsive Design**: Modern UI built with React and Material-UI

## <img src="./docs/images/icon.png" width="24" align="top"> Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)

## <img src="./docs/images/icon.png" width="24" align="top"> Installation

### Clone the repository
```bash
git clone https://github.com/dsddevs/trade_price_predictor.git
cd trade_price_predictor
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd tp_server
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd tp_client
```

2. Install dependencies:
```bash
npm install
```

3. Build the production bundle:
```bash
npm run build
```

## <img src="./docs/images/icon.png" width="24" align="top"> Running the Application

### Development Mode

**Backend:**
```bash
uvicorn tp_server.app.server:app --reload --port 8001
```

**Frontend:**
```bash
cd tp_client
npm run dev
```

### Production Mode
```bash
cd tp_server
uvicorn app.server:app --host 0.0.0.0 --port 8001
```

Access the application at `http://localhost:8001`

## <img src="./docs/images/icon.png" width="24" align="top"> Docker Deployment
```bash
docker build -t trade-predictor .
docker run -p 8001:8001 trade-predictor
```

## <img src="./docs/images/icon.png" width="24" align="top"> API Documentation

Once the server is running, access the interactive API documentation at:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

### Key Endpoints

- `GET /api/ticker-data` - Get historical price data
- `GET /api/actual-data` - Get actual market data
- `WS /ws/forecast_data` - WebSocket for price predictions
- `WS /ws/news_data` - WebSocket for financial news

## <img src="./docs/images/icon.png" width="24" align="top"> Testing

Run the test suite:
```bash
cd tp_server
pytest
```

For coverage report:
```bash
pytest --cov=. --cov-report=html
```

## <img src="./docs/images/icon.png" width="24" align="top"> Project Structure
```
trade_price_predictor/
├── tp_client/              # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store
│   │   ├── forecast/       # Forecasting features
│   │   └── news/           # News features
│   └── dist/               # Production build
├── tp_server/              # FastAPI backend
│   ├── app/
│   │   ├── server.py       # Main application
│   │   ├── forecast.py     # Prediction logic
│   │   ├── news.py         # News aggregation
│   │   └── yfinance.py     # Market data
│   └── tests/              # Test suite
└── docker-compose.yml      # Docker configuration
```

## <img src="./docs/images/icon.png" width="24" align="top"> Configuration

### Environment Variables

Create a `.env` file in the `tp_server` directory:
```env
# API Keys
POLYGON_API_KEY=your_polygon_api_key
NEWS_API_KEY=your_news_api_key

# Server Configuration
HOST=0.0.0.0
PORT=8001
ENVIRONMENT=production

# Database (if applicable)
DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:3001,https://yourdomain.com
```

## <img src="./docs/images/icon.png" width="24" align="top"> License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## <img src="./docs/images/icon.png" width="24" align="top"> Acknowledgments

- Yahoo Finance for market data
- Polygon.io for financial APIs
- FastAPI for the backend framework
- React team for the frontend framework

## <img src="./docs/images/icon.png" width="24" align="top"> Contact

- 📧 dsddevs@gmail.com
- <img src="./docs/images/telegram.png" width="24" valign="middle"> @dsddevs / +998906006989

## <img src="./docs/images/icon.png" width="24" align="top"> Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-yellowgreen)

---

**Note**: This is a financial analytics tool and should not be used as the sole basis for investment decisions. Always consult with qualified financial advisors.
