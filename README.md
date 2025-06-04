# SocialFlow - Advanced Social Media Platform

A modern and user-friendly social media platform built with React, Express, and PostgreSQL.

## Features

- **Content Sharing**: Text and image posts with comments and likes
- **Social Interaction**: User profiles, follow system, and real-time messaging
- **Community Features**: Groups, events, and discussion forums
- **Personal Tools**: Saved posts, categorized content, and advanced search
- **Modern UX**: Responsive design, dark mode, and customizable settings

## Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Query  
**Backend:** Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL  
**Tools:** Vite, ESBuild, Drizzle Kit

## Quick Start

1. **Clone and install:**
```bash
git clone <repository-url>
cd socialflow
npm install
```

2. **Setup environment:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/socialflow
NODE_ENV=development
```

3. **Initialize database:**
```bash
npm run db:push
```

4. **Start development:**
```bash
npm run dev
```

Visit `http://localhost:5000`

## Project Structure

```
socialflow/
├── client/src/           # React frontend
│   ├── components/       # UI components
│   ├── pages/           # Page components
│   └── lib/             # Utilities
├── server/              # Express backend
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data layer
├── shared/             # Shared types
└── README.md
```

## API Endpoints

- `GET /api/feed` - Main feed
- `POST /api/posts` - Create post
- `GET /api/users/:id` - User profile
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comments` - Add comment

## License

MIT License

---

Built with modern web technologies for a seamless social media experience.
