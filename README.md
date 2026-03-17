# Sair

A self-hosted portfolio platform built with Laravel and React. Create a personalized portfolio website with a built-in admin dashboard, visitor analytics, and extensive customization options.

## Features

**Public Portfolio**
- Customizable sections: Hero, Projects, Experience, Education, Contact
- Interactive animations: cursor trail, floating particles, section wipe transitions, typewriter, spotlight cursor, smooth scroll with parallax
- CV download with download tracking
- Social media links
- Responsive design

**Admin Dashboard**
- Visitor analytics: total views, downloads, unique visitors, 30-day trend charts
- Device breakdown (mobile / desktop / tablet)
- Top pages and referrers
- Recent visitor log

**Portfolio Management**
- Profile: name, bio, tagline, social links, CV upload
- Projects: images, tags, GitHub and demo links, sort order
- Experience: company, role, duration, technologies
- Education: institution, degree, field of study, GPA
- Sections: reorder and toggle visibility of each section and individual elements
- Appearance: heading/body fonts, color scheme, animation style, favicon
- Import portfolio data from a JSON file

**Account Settings**
- Update profile and password
- Two-factor authentication

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Laravel 12 + Inertia.js 2 |
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS 4 + Radix UI |
| Auth | Laravel Fortify (2FA ready) |
| Testing | Pest + PHPUnit |
| Database | SQLite (default), MySQL or PostgreSQL |

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- npm

## Installation

**Quick setup (one command)**

```bash
composer setup
```

This installs all dependencies, creates the `.env` file, generates the application key, runs migrations, and builds the frontend assets.

**Manual setup**

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
```

## Running the Application

**Development** (Laravel server + queue + logs + Vite hot reload)

```bash
composer dev
```

**Development with SSR**

```bash
composer dev:ssr
```

**Production**

```bash
npm run build
php artisan serve
```

The application is available at `http://localhost:8000` by default.

## Testing

```bash
composer test
```

## Code Quality

```bash
# Run all CI checks
composer ci:check

# PHP
composer lint          # fix style
composer lint:check    # check style

# Frontend
npm run lint           # fix linting issues
npm run lint:check     # check linting
npm run format         # format with Prettier
npm run format:check   # check formatting
npm run types:check    # TypeScript validation
```

## Environment

Copy `.env.example` to `.env` and update as needed. Key variables:

```
APP_NAME=Sair
APP_URL=http://localhost

DB_CONNECTION=sqlite   # or mysql / pgsql

FILESYSTEM_DISK=local
```

## License

MIT
