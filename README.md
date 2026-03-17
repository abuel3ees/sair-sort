# Sair — Portfolio CMS

A self-hosted portfolio management system built with **Laravel 12**, **React 19**, and **Inertia.js**. Manage your projects, work experience, education, and public profile from a sleek admin dashboard — with live analytics and full appearance customisation.

## Features

- **Public portfolio page** — hero, projects carousel, experience timeline, education, and contact section
- **Admin dashboard** — manage every section of your portfolio through a polished UI
- **Analytics** — track page views, unique visitors, CV downloads, device breakdown, top pages, and referrers
- **CV upload & tracked download** — serve your résumé and record every download event
- **JSON import** — bulk-import portfolio data from a JSON file
- **Appearance customisation** — choose fonts, colour schemes, animation styles, section order, and granular element visibility toggles
- **Favicon management** — upload a custom site favicon from the admin
- **Authentication** — secure admin area with two-factor support (Laravel Fortify)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.2+, Laravel 12, Inertia.js (server) |
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Build | Vite 7 |
| Database | SQLite (default), MySQL / PostgreSQL compatible |
| Testing | Pest 4 |
| Linting | Laravel Pint (PHP), ESLint + Prettier (JS/TS) |

## Requirements

- PHP ≥ 8.2 with the extensions required by Laravel
- Composer 2
- Node.js ≥ 20 and npm

## Quick Start

```bash
# 1. Clone
git clone https://github.com/abuel3ees/sair-sort.git
cd sair-sort

# 2. Install dependencies & bootstrap
composer run setup
```

`composer run setup` does the following in one step:

1. `composer install`
2. Copy `.env.example` → `.env`
3. Generate the application key
4. Run database migrations
5. `npm install`
6. `npm run build`

> **Manual steps** — if you prefer to run each command yourself:
>
> ```bash
> composer install
> cp .env.example .env
> php artisan key:generate
> php artisan migrate
> npm install
> npm run build
> ```

## Development Server

```bash
composer dev
```

This starts the Laravel server, queue worker, log tail, and Vite dev server concurrently.

## Running Tests

```bash
# PHP tests (Pest)
php artisan test

# Or via the full CI check (lint + format + types + tests)
composer ci:check
```

## Linting & Formatting

```bash
# PHP (Pint)
composer lint

# JavaScript / TypeScript
npm run lint
npm run format
```

## CI / CD

GitHub Actions workflows are located in `.github/workflows/`:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `lint.yml` | push / PR to `main`, `master`, `develop`, `workos` | Runs PHP Pint, Prettier, and ESLint |
| `tests.yml` | push / PR to `main`, `master`, `develop`, `workos` | Installs deps, builds assets, and runs the Pest test suite on PHP 8.2 and 8.4 |

## Environment Variables

Copy `.env.example` to `.env` and adjust the values for your environment. Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost` | Public URL of your site |
| `DB_CONNECTION` | `sqlite` | Database driver (`sqlite`, `mysql`, `pgsql`) |
| `FILESYSTEM_DISK` | `local` | Storage disk for uploaded files |
| `MAIL_MAILER` | `log` | Mail driver for notifications |

## License

This project is open-source software licensed under the [MIT licence](https://opensource.org/licenses/MIT).
