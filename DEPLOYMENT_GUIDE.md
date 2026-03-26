# SafeMap PH Deployment Guide

This guide will walk you through deploying the SafeMap PH system to production.

## Prerequisites

- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 18+, npm/pnpm/yarn
- **Database**: SQLite (default) or PostgreSQL

---

## Local Development Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
copy .env.example .env
# Linux/Mac:
cp .env.example .env

# Edit .env with your configuration
```

### 2. Initialize Database

```bash
# Run the database initialization script
python init_db.py
```

### 3. Start Backend Server

```bash
# Development mode
python run.py

# Or using Flask CLI
flask run --host=0.0.0.0 --port=5000
```

The backend will be available at `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (using pnpm recommended)
pnpm install

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:5173`

---

## Production Deployment

### Option A: Traditional Server Deployment

#### Backend (Python/Flask with Gunicorn)

1. **Install production dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables**:
Create a `.env` file:
```env
FLASK_ENV=production
SECRET_KEY=your-secure-secret-key
JWT_SECRET_KEY=your-secure-jwt-secret
DATABASE_URL=sqlite:///samapph.db
PORT=5000
LOG_LEVEL=INFO
```

3. **Run with Gunicorn**:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

#### Frontend (React/Vite)

1. **Build the application**:
```bash
cd frontend
pnpm install
pnpm build
```

2. **Serve static files**:
You can use any static file server (Nginx, Apache, or serve):
```bash
# Using serve
npx serve dist -l 3000
```

### Option B: Docker Deployment

1. **Create Dockerfile for Backend**:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()"]
```

2. **Create Dockerfile for Frontend**:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install
COPY frontend/ .
RUN pnpm build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

3. **Create docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "80:80"
```

4. **Run Docker**:
```bash
docker-compose up -d
```

### Option C: Cloud Platform Deployment

#### Render.com (Recommended for Free Tier)

1. **Backend**:
   - Connect your GitHub repository
   - Build command: `cd backend && pip install -r requirements.txt`
   - Start command: `gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"`
   - Add environment variables in Render dashboard

2. **Frontend**:
   - Create a static site
   - Build command: `cd frontend && pnpm install && pnpm build`
   - Publish directory: `frontend/dist`

#### Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Initialize: `railway init`
3. Add PostgreSQL plugin for production database
4. Deploy with `railway up`

#### Vercel (Frontend) + Render/Railway (Backend)

1. **Frontend on Vercel**:
   - Connect GitHub repo to Vercel
   - Framework preset: Vite
   - Build command: `pnpm build`
   - Output directory: `dist`

2. **Backend on Render/Railway**:
   - Deploy Flask API
   - Update frontend API URL in environment

---

## Production Checklist

### Security

- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Change `JWT_SECRET_KEY` to a secure random string
- [ ] Update CORS origins in `config.py` to your production domain
- [ ] Enable HTTPS/SSL

### Database

- [ ] Use PostgreSQL for production (recommended)
- [ ] Set up regular database backups
- [ ] Configure connection pooling

### Environment Variables

Required production variables:
```env
SECRET_KEY=<generate-secure-key>
JWT_SECRET_KEY=<generate-secure-key>
DATABASE_URL=postgresql://user:pass@host:5432/safemap
FLASK_ENV=production
LOG_LEVEL=WARNING
```

### Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React)
    location / {
        root /var/www/safemap/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend (Flask API)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Default Admin Account

After running `init_db.py`, a default admin account is created:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default admin password immediately after first login!

---

## Troubleshooting

### Backend Issues

1. **Database errors**: Ensure database file has proper permissions
2. **Port already in use**: Change PORT in .env or stop other services
3. **Module not found**: Ensure all dependencies are installed

### Frontend Issues

1. **API connection errors**: Verify backend URL in development
2. **Build errors**: Clear node_modules and reinstall dependencies

### Common Solutions

```bash
# Clear Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Reset database
rm safemap.db
python init_db.py
```

---

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vite React Guide](https://vitejs.dev/guide/)
- [Leaflet.js Docs](https://leafletjs.com/)