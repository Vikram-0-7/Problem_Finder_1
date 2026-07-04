# 🏛️ Government Problem Finder

An AI-powered platform that **discovers, extracts, and catalogs civic problems** from Indian government web portals using a local Retrieval-Augmented Generation (RAG) pipeline. Search for issues like teacher vacancies, infrastructure gaps, or public health concerns — and get structured, source-verified results in seconds.

---

## 📸 Screenshots

### 🏠 Home Page

<p align="center">
  <img src="./web_photos/Home_page.png" alt="Home Page" width="900"/>
</p>

### 🔍 Discover Page

<p align="center">
  <img src="./web_photos/Discover.png" alt="Discover Page" width="900"/>
</p>


---

## ✨ Features

| Feature | Description |
|---|---|
| **🔍 Live Search** | Real-time search across `gov.in` portals with concurrent scraping |
| **🤖 Local RAG Pipeline** | Intelligent paragraph scoring reduces LLM input by ~90%, preventing rate limits |
| **📊 Dashboard** | Visual analytics with category breakdowns, severity charts, and trend data |
| **📄 Reports** | Dynamic report cards for 8 whitelisted government agencies |
| **💬 AI Chat** | Conversational interface to explore discovered problems |
| **🔖 Bookmarks** | Save and organize problems for later reference |
| **🧭 Discover** | Browse and filter the full problem database |
| **👤 Profile** | User preferences and activity tracking |

---

## 🏗️ Architecture

```mermaid
graph TD
    A[React + TypeScript Frontend] <-->|REST API| B[FastAPI Backend]
    B <-->|Async Queries| C[Neon PostgreSQL]
    B -->|Site-scoped Search| D[DuckDuckGo]
    B -->|Scrapes Pages| E[Government Portals]
    B -->|RAG Snippets| F[Groq — Llama 3.1]
```

### How It Works

1. **Search** — User enters a query (e.g., *"Ministry of Education teacher shortage"*)
2. **Database Check** — Backend checks for existing results via `ILIKE` queries
3. **Scrape** — If insufficient results, DuckDuckGo finds `site:gov.in` URLs and pages are scraped concurrently
4. **Local RAG** — Raw page text is chunked into paragraphs, scored for relevance (query match, problem indicators, statistics), and the top snippets are capped at ~3,500 characters
5. **AI Extraction** — Groq's Llama 3.1 extracts structured problem JSON from the filtered context
6. **Deduplication** — New problems are deduplicated (>85% title similarity check) and stored in PostgreSQL

> For a deep dive, see [`HOW_IT_WORKS.md`](./HOW_IT_WORKS.md)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript 6** (Vite 8)
- **Tailwind CSS 3** for styling
- **Framer Motion** for page transitions and animations
- **Recharts** for data visualization
- **Lucide React** + **React Icons** for iconography
- **React Router v7** with lazy-loaded routes

### Backend
- **FastAPI** with async support
- **SQLAlchemy 2** (async) + **asyncpg** for database access
- **Neon PostgreSQL** (serverless Postgres)
- **httpx** + **BeautifulSoup4** for concurrent scraping
- **DDGS** (DuckDuckGo Search) for search engine queries
- **Groq SDK** for LLM inference (Llama 3.1)
- **Alembic** for database migrations

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.12+**
- **Node.js 20+** and **npm**
- A **Neon PostgreSQL** database (or any PostgreSQL instance)
- A **Groq API key** ([console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/government-problem-finder.git
cd government-problem-finder
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory (see `.env.example`):

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

Start the backend server:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
government-problem-finder/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entrypoint
│   │   ├── config.py          # Environment & settings
│   │   ├── database.py        # Async DB engine & session
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── routers/           # API route handlers
│   │   └── services/          # Scraping, RAG, & AI logic
│   ├── .env.example           # Environment template
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Root component with routing
│   │   ├── pages/             # Page components (Home, Discover, etc.)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API client (Axios)
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── HOW_IT_WORKS.md            # Detailed architecture documentation
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) | ✅ |
| `GROQ_API_KEY` | API key from [Groq Console](https://console.groq.com) | ✅ |
| `GROQ_MODEL` | Groq model identifier (default: `llama-3.1-8b-instant`) | ✅ |

---
