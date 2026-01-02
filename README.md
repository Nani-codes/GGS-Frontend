# Green Gold Seeds - Monorepo

This is a monorepo containing:
- **Frontend**: Next.js application with internationalization (i18n)
- **Backend**: Strapi CMS for content management

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 6.0.0

### Installation

Install all dependencies for both frontend and backend:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install root and frontend dependencies
npm install

# Install Strapi dependencies
cd strapi && npm install
```

### Development

Run both frontend and backend servers simultaneously with a single command:

```bash
npm run dev
```

This will start:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend (Strapi)**: [http://localhost:1337](http://localhost:1337)

### Individual Commands

You can also run the servers individually:

```bash
# Frontend only
npm run dev:frontend

# Strapi only
npm run dev:strapi
```

## 📦 Available Scripts

### Root Level

- `npm run dev` - Run both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run install:all` - Install dependencies for all workspaces

### Frontend Scripts

- `npm run dev:frontend` - Start Next.js development server
- `npm run build:frontend` - Build Next.js application
- `npm run start:frontend` - Start Next.js production server
- `npm run lint` - Run ESLint

### Backend Scripts (Strapi)

- `npm run dev:strapi` - Start Strapi development server
- `npm run build:strapi` - Build Strapi application
- `npm run start:strapi` - Start Strapi production server

## 🏗️ Project Structure

```
green-gold-seeds/
├── src/                    # Next.js frontend source
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── i18n/              # Internationalization config
│   └── messages/          # Translation files
├── strapi/                # Strapi backend
│   ├── src/               # Strapi source code
│   ├── config/            # Strapi configuration
│   └── public/            # Strapi public files
├── public/                # Next.js public assets
└── package.json           # Root package.json with workspaces
```

## 🌐 Internationalization

The frontend supports multiple locales:
- English (en)
- Hindi (hi)
- Marathi (mr)

## 🔧 Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Strapi 5, SQLite
- **Monorepo**: npm workspaces

## 📝 Notes

- The frontend fetches products from Strapi API at `http://localhost:1337/api/products`
- Make sure Strapi is running before accessing product data in the frontend
- Both servers run concurrently when using `npm run dev`
