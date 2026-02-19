# Laravel to Next.js Conversion Guide

## Simple Explanation

This guide shows how to change your Laravel movie streaming app to Next.js. We will only change the folder names. Everything else stays the same.

---

## What Changes and What Stays the Same

### What Changes (Only Folder Structure)

| Old (Laravel)              | New (Next.js)            |
| -------------------------- | ------------------------ |
| `app/Http/Controllers/`    | `src/actions/`           |
| `app/Models/`              | `src/lib/models/`        |
| `resources/js/pages/`      | `src/app/`               |
| `resources/js/components/` | `src/components/`        |
| `resources/js/hooks/`      | `src/hooks/`             |
| `routes/web.php`           | `src/app/*/page.tsx`     |
| `routes/api.php`           | `src/app/api/*/route.ts` |
| `config/database.php`      | `prisma/schema.prisma`   |

### What Stays Exactly the Same

- All PHP code logic
- All validation rules
- All error messages
- All TMDB API calls
- All movie data handling
- All comment system
- All user authentication
- All admin features
- All React components (no changes)
- All CSS styles
- All comments in code (we keep them!)

---

## New Next.js Folder Tree

```
streaminga-app/
├── prisma/
│   └── schema.prisma          # Database (from Laravel migrations)
├── src/
│   ├── app/                   # All pages live here
│   │   ├── (auth)/           # Login, Register, Password pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── two-factor/
│   │   │       └── page.tsx
│   │   ├── (main)/           # Main user pages
│   │   │   ├── izisobanuye/
│   │   │   │   └── page.tsx  # Was: resources/js/pages/izisobanuye.tsx
│   │   │   ├── izidasobanuye/
│   │   │   │   └── page.tsx  # Was: resources/js/pages/izidasobanuye.tsx
│   │   │   ├── movies/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Was: movie-details.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── subscription/
│   │   │       └── page.tsx
│   │   ├── admin/            # Admin pages
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── movies/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── comments/
│   │   │   │   └── page.tsx
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── subscriptions/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── hero/
│   │   │       └── page.tsx
│   │   ├── settings/         # User settings
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── password/
│   │   │   │   └── page.tsx
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx
│   │   │   └── two-factor/
│   │   │       └── page.tsx
│   │   ├── api/             # API routes
│   │   │   ├── movies/
│   │   │   │   └── route.ts
│   │   │   ├── comments/
│   │   │   │   └── route.ts
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── layout.tsx       # Main layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components (NO CHANGES)
│   │   ├── ui/              # Button, Input, Card, etc.
│   │   ├── admin-sidebar.tsx
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── nav-user.tsx
│   │   ├── notification-bell.tsx
│   │   └── ... (all other components)
│   ├── hooks/               # Custom hooks (NO CHANGES)
│   │   ├── use-appearance.ts
│   │   ├── use-clipboard.ts
│   │   ├── use-mobile.ts
│   │   └── ... (all other hooks)
│   ├── lib/                 # Utilities and models
│   │   ├── db.ts           # Database connection
│   │   ├── auth.ts         # NextAuth setup
│   │   ├── utils.ts        # Utility functions
│   │   └── models/         # TypeScript types
│   │       ├── movie.ts
│   │       ├── user.ts
│   │       ├── comment.ts
│   │       └── ... (all models)
│   ├── actions/            # Server Actions (from Controllers)
│   │   ├── movie-actions.ts    # Was: MovieController.php
│   │   ├── comment-actions.ts  # Was: CommentController.php
│   │   ├── user-actions.ts    # Was: UserController.php
│   │   └── auth-actions.ts    # Was: Auth controllers
│   ├── contexts/            # React contexts
│   │   ├── auth-context.tsx
│   │   └── appearance-context.tsx
│   └── types/
│       └── index.ts
├── public/                  # Static files (NO CHANGES)
│   ├── Images/
│   │   ├── logo.png
│   │   └── movies/
│   └── favicon.ico
├── package.json            # Updated for Next.js
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── prisma/
    └── schema.prisma
```

---

## File Mapping (Laravel → Next.js)

### Backend Files

| Laravel File                                    | Goes To                               |
| ----------------------------------------------- | ------------------------------------- |
| `app/Http/Controllers/MovieController.php`      | `src/actions/movie-actions.ts`        |
| `app/Http/Controllers/CommentController.php`    | `src/actions/comment-actions.ts`      |
| `app/Http/Controllers/UserController.php`       | `src/actions/user-actions.ts`         |
| `app/Http/Controllers/Auth/*.php`               | `src/actions/auth-actions.ts`         |
| `app/Http/Controllers/Settings/*.php`           | `src/actions/settings-actions.ts`     |
| `app/Http/Middleware/CheckAdminRole.php`        | `src/middleware/admin.ts`             |
| `app/Http/Middleware/HandleInertiaRequests.php` | `src/middleware/inertia.ts`           |
| `app/Models/Movie.php`                          | `src/lib/models/movie.ts`             |
| `app/Models/IzisobanuyeMovie.php`               | `src/lib/models/izisobanuye-movie.ts` |
| `app/Models/Comment.php`                        | `src/lib/models/comment.ts`           |
| `app/Models/User.php`                           | `src/lib/models/user.ts`              |
| `app/Models/Hero.php`                           | `src/lib/models/hero.ts`              |
| `app/Models/MovieViewNotification.php`          | `src/lib/models/notification.ts`      |
| `database/migrations/*.php`                     | `prisma/schema.prisma`                |
| `database/seeders/*.php`                        | `prisma/seed.ts`                      |
| `routes/web.php`                                | `src/app/*/page.tsx`                  |
| `routes/api.php`                                | `src/app/api/*/route.ts`              |
| `config/auth.php`                               | `src/lib/auth.ts`                     |
| `config/database.php`                           | `prisma/schema.prisma`                |

### Frontend Files

| Laravel File                                       | Goes To                                    |
| -------------------------------------------------- | ------------------------------------------ |
| `resources/js/pages/welcome.tsx`                   | `src/app/(main)/izidasobanuye/page.tsx`    |
| `resources/js/pages/izisobanuye.tsx`               | `src/app/(main)/izisobanuye/page.tsx`      |
| `resources/js/pages/izidasobanuye.tsx`             | `src/app/(main)/izidasobanuye/page.tsx`    |
| `resources/js/pages/movie-details.tsx`             | `src/app/(main)/movies/[id]/page.tsx`      |
| `resources/js/pages/izisobanuye-movie-details.tsx` | `src/app/(main)/izisobanuye/[id]/page.tsx` |
| `resources/js/pages/auth/login.tsx`                | `src/app/(auth)/login/page.tsx`            |
| `resources/js/pages/auth/register.tsx`             | `src/app/(auth)/register/page.tsx`         |
| `resources/js/pages/dashboard.tsx`                 | `src/app/(main)/dashboard/page.tsx`        |
| `resources/js/pages/admin/dashboard.tsx`           | `src/app/admin/dashboard/page.tsx`         |
| `resources/js/pages/admin/movies.tsx`              | `src/app/admin/movies/page.tsx`            |
| `resources/js/pages/admin/users.tsx`               | `src/app/admin/users/page.tsx`             |
| `resources/js/pages/admin/comments.tsx`            | `src/app/admin/comments/page.tsx`          |
| `resources/js/pages/admin/notifications.tsx`       | `src/app/admin/notifications/page.tsx`     |
| `resources/js/pages/admin/reports.tsx`             | `src/app/admin/reports/page.tsx`           |
| `resources/js/pages/settings/profile.tsx`          | `src/app/settings/profile/page.tsx`        |
| `resources/js/pages/settings/two-factor.tsx`       | `src/app/settings/two-factor/page.tsx`     |
| `resources/js/components/*.tsx`                    | `src/components/*.tsx`                     |
| `resources/js/components/ui/*.tsx`                 | `src/components/ui/*.tsx`                  |
| `resources/js/hooks/*.ts`                          | `src/hooks/*.ts`                           |
| `resources/js/contexts/*.tsx`                      | `src/contexts/*.tsx`                       |
| `resources/js/layouts/*.tsx`                       | `src/app/layout.tsx`                       |
| `resources/css/app.css`                            | `src/app/globals.css`                      |

---

## How Routes Change

| Laravel Route              | Next.js URL                       |
| -------------------------- | --------------------------------- |
| `GET /`                    | `/` (redirects to /izidasobanuye) |
| `GET /izisobanuye`         | `/izisobanuye`                    |
| `GET /izidasobanuye`       | `/izidasobanuye`                  |
| `GET /movies/{id}`         | `/movies/[id]`                    |
| `GET /dashboard`           | `/dashboard`                      |
| `GET /subscription`        | `/subscription`                   |
| `GET /admin/dashboard`     | `/admin/dashboard`                |
| `GET /admin/movies`        | `/admin/movies`                   |
| `GET /admin/users`         | `/admin/users`                    |
| `GET /admin/comments`      | `/admin/comments`                 |
| `GET /admin/notifications` | `/admin/notifications`            |
| `GET /admin/reports`       | `/admin/reports`                  |
| `GET /admin/analytics`     | `/admin/analytics`                |
| `GET /admin/subscriptions` | `/admin/subscriptions`            |
| `GET /admin/settings`      | `/admin/settings`                 |
| `GET /admin/hero`          | `/admin/hero`                     |
| `GET /login`               | `/login`                          |
| `GET /register`            | `/register`                       |
| `GET /settings/profile`    | `/settings/profile`               |
| `GET /settings/password`   | `/settings/password`              |
| `GET /settings/appearance` | `/settings/appearance`            |
| `GET /settings/two-factor` | `/settings/two-factor`            |

---

## Technology Changes

| Part       | Laravel          | Next.js            |
| ---------- | ---------------- | ------------------ |
| Language   | PHP 8.2          | TypeScript         |
| Server     | Laravel          | Next.js            |
| Auth       | Laravel Fortify  | NextAuth.js        |
| Database   | Eloquent ORM     | Prisma ORM         |
| API        | Laravel Routes   | Next.js API Routes |
| Pages      | Inertia.js       | Next.js Pages      |
| Forms      | Laravel Forms    | React Hook Form    |
| Validation | Laravel Requests | Zod                |

---

## Important Rules We Follow

### We KEEP (No Changes)

- All movie streaming logic
- All TMDB API calls
- All comment system
- All user authentication
- All admin features
- All validation rules
- All error messages
- All comments in code (very important!)
- All CSS styles
- All React components

### We CHANGE (Only Folders)

- Folder names (to Next.js structure)
- PHP files become TypeScript
- Laravel routes become Next.js pages
- Eloquent models become Prisma

---

## Performance Confirmation

The app will work **exactly the same** after conversion:

1. **Same Speed**: Next.js SSR is similar to Laravel
2. **Same Data**: Database stays the same
3. **Same Features**: All features work exactly as before
4. **Same Look**: No UI changes at all

---

## Summary

This conversion is just reorganizing folders. The app will:

- Show the same movies
- Handle comments the same way
- Work with the same database
- Look exactly the same
- Have all the same features

Everything stays the same. Only the folder structure changes to follow Next.js standards.
