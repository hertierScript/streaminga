# Laravel to Next.js Migration Plan

## Project Overview

This is a comprehensive migration plan to convert the Laravel movie streaming app to Next.js while preserving all existing logic, behavior, features, and comments exactly the same. Only the folder structure will change to follow Next.js conventions.

---

## Current Laravel Project Structure

```
/run/media/intare/Disk D/STREAMINGA/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MovieController.php       (1281 lines - Core movie logic)
│   │   │   ├── CommentController.php    (155 lines - Comments)
│   │   │   ├── UserController.php        (112 lines - User management)
│   │   │   ├── Controller.php
│   │   │   ├── Auth/
│   │   │   │   ├── AuthenticatedSessionController.php
│   │   │   │   ├── RegisteredUserController.php
│   │   │   │   ├── EmailVerificationNotificationController.php
│   │   │   │   ├── EmailVerificationPromptController.php
│   │   │   │   ├── NewPasswordController.php
│   │   │   │   ├── PasswordResetLinkController.php
│   │   │   │   ├── VerifyEmailController.php
│   │   │   ├── Settings/
│   │   │   │   ├── PasswordController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   └── TwoFactorAuthenticationController.php
│   │   ├── Middleware/
│   │   │   ├── CheckAdminRole.php
│   │   │   ├── HandleAppearance.php
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/
│   │       ├── Auth/LoginRequest.php
│   │       └── Settings/ProfileUpdateRequest.php, TwoFactorAuthenticationRequest.php
│   ├── Models/
│   │   ├── Movie.php                     (TMDB movies)
│   │   ├── IzisobanuyeMovie.php          (Translated/local movies)
│   │   ├── Comment.php
│   │   ├── User.php
│   │   ├── Hero.php                      (Hero banner)
│   │   └── MovieViewNotification.php
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── FortifyServiceProvider.php
├── database/
│   ├── migrations/                       (16 migration files)
│   └── seeders/                         (MovieSeeder, IzisobanuyeMovieSeeder, etc.)
├── routes/
│   ├── web.php                          (Main route definitions)
│   ├── auth.php                         (Fortify auth routes)
│   └── settings.php                     (Settings routes)
├── resources/
│   └── js/
│       ├── components/                  (React components)
│       ├── pages/                       (Inertia pages)
│       ├── hooks/                       (Custom hooks)
│       ├── contexts/                    (React contexts)
│       ├── layouts/                     (Layout components)
│       └── lib/                         (Utilities)
├── config/                              (Laravel configs)
├── public/                             (Static assets)
└── composer.json, package.json, tsconfig.json, vite.config.ts
```

---

## Key Application Logic to Preserve

### 1. Movie Management

- **TMDB API Integration**: Popular movies, search, genre-based fetching
- **Two Movie Types**:
    - `Movie` model - TMDB movies (izidasobanuye = not translated)
    - `IzisobanuyeMovie` model - Local/translated movies
- **View counting with notifications**
- **Movie file uploads** (poster and video files)
- **Admin movie management** with search, filter, sort, pagination

### 2. User & Authentication

- **Laravel Fortify** for authentication (login, register, password reset, 2FA)
- **Role-based access** (admin, super_admin, user)
- **Subscription management** (active, expired, trial, canceled)
- **Two-factor authentication**

### 3. Comments System

- **Public comments** with approval workflow
- **Admin comment management** (approve, flag, delete, reply)
- **Comment filtering** by status, movie type, date

### 4. Admin Dashboard

- **Dashboard stats** (views, comments, subscribers, revenue)
- **Reports** with time range filtering
- **Analytics** (top movies, user activity, watch duration)
- **Hero banner management**
- **User management**

### 5. Frontend (React + Inertia)

- **UI Components** (shadcn/ui style)
- **Authentication pages** (login, register, 2FA, password reset)
- **Admin pages** (dashboard, movies, users, comments, notifications, reports)
- **Public pages** (izisobanuye, izidasobanuye, movie details)

---

## Laravel to Next.js Mapping

### Backend (PHP → TypeScript/Server Actions)

| Laravel Component                           | Next.js Equivalent            | Notes                                    |
| ------------------------------------------- | ----------------------------- | ---------------------------------------- |
| `app/Http/Controllers/MovieController.ts`   | `app/api/movies/actions.ts`   | Server Actions for movie CRUD            |
| `app/Http/Controllers/CommentController.ts` | `app/api/comments/actions.ts` | Server Actions for comments              |
| `app/Http/Controllers/UserController.ts`    | `app/api/users/actions.ts`    | Server Actions for user management       |
| `app/Http/Controllers/Auth/*`               | `app/api/auth/*`              | NextAuth.js or custom auth               |
| `app/Http/Middleware/CheckAdminRole.ts`     | `app/api/admin/middleware.ts` | Middleware for route protection          |
| `app/Models/*.php`                          | `app/lib/models/*.ts`         | TypeScript interfaces mirroring Eloquent |
| `config/database.php`                       | `prisma/schema.prisma`        | Database schema (Prisma ORM)             |
| `routes/web.php`                            | `app/api/*/route.ts`          | API route handlers                       |
| `app/Providers/*`                           | `app/providers/*`             | React Context providers                  |

### Frontend (React/Inertia → Next.js)

| Laravel (Inertia)          | Next.js (App Router) |
| -------------------------- | -------------------- |
| `resources/js/pages/`      | `app/`               |
| `resources/js/components/` | `app/components/`    |
| `resources/js/hooks/`      | `app/hooks/`         |
| `resources/js/contexts/`   | `app/context/`       |
| `resources/js/layouts/`    | `app/layout.tsx`     |
| `resources/js/data/`       | `app/lib/data/`      |

---

## New Next.js Folder Structure

```
/run/media/intare/Disk D/STREAMINGA/
├── prisma/
│   └── schema.prisma                    # Database schema (converted from migrations)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   └── two-factor-challenge/
│   │   │       └── page.tsx
│   │   ├── (main)/
│   │   │   ├── izisobanuye/
│   │   │   │   └── page.tsx             # Local/translated movies
│   │   │   ├── izidasobanuye/
│   │   │   │   └── page.tsx             # TMDB original movies
│   │   │   ├── movies/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Movie details
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── subscription/
│   │   │       └── page.tsx
│   │   ├── admin/
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
│   │   ├── settings/
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── password/
│   │   │   │   └── page.tsx
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx
│   │   │   └── two-factor/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── movies/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── comments/
│   │   │   │   └── route.ts
│   │   │   ├── users/
│   │   │   │   └── route.ts
│   │   │   ├── notifications/
│   │   │   │   └── route.ts
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home (redirects to /izidasobanuye)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   │   └── ... (all UI components)
│   │   ├── admin-sidebar.tsx
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── nav-user.tsx
│   │   ├── notification-bell.tsx
│   │   └── ... (all other components)
│   ├── hooks/
│   │   ├── use-appearance.ts
│   │   ├── use-clipboard.ts
│   │   ├── use-mobile.ts
│   │   └── ... (all hooks)
│   ├── lib/
│   │   ├── db.ts                        # Prisma client
│   │   ├── auth.ts                      # NextAuth config
│   │   ├── utils.ts                     # Utility functions
│   │   └── models/                      # TypeScript interfaces (from Laravel models)
│   │       ├── movie.ts
│   │       ├── user.ts
│   │       ├── comment.ts
│   │       └── ...
│   ├── actions/                         # Server Actions (from Laravel Controllers)
│   │   ├── movie-actions.ts
│   │   ├── comment-actions.ts
│   │   ├── user-actions.ts
│   │   └── auth-actions.ts
│   ├── contexts/
│   │   ├── auth-context.tsx
│   │   └── appearance-context.tsx
│   └── types/
│       └── index.ts
├── public/
│   ├── Images/                         # Movie posters
│   └── logo.svg
├── package.json                        # Updated for Next.js
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── prisma/
    └── schema.prisma                  # Database schema
```

---

## Detailed File Mapping

### Controllers → Server Actions

| Laravel Controller                                | Next.js Server Action            | Lines     |
| ------------------------------------------------- | -------------------------------- | --------- |
| `MovieController::popular()`                      | `getPopularMovies()`             | 17-27     |
| `MovieController::search()`                       | `searchMovies()`                 | 29-47     |
| `MovieController::show()`                         | `getMovie()`                     | 49-62     |
| `MovieController::details()`                      | `getMovieDetails()`              | 106-193   |
| `MovieController::action()`                       | `getActionMovies()`              | 81-84     |
| `MovieController::horror()`                       | `getHorrorMovies()`              | 86-89     |
| `MovieController::comedy()`                       | `getComedyMovies()`              | 91-94     |
| `MovieController::drama()`                        | `getDramaMovies()`               | 96-99     |
| `MovieController::romance()`                      | `getRomanceMovies()`             | 101-104   |
| `MovieController::getAllMovies()`                 | `getAllAdminMovies()`            | 255-297   |
| `MovieController::store()`                        | `createMovie()`                  | 795-838   |
| `MovieController::storeIzisobanuyeMovie()`        | `createIzisobanuyeMovie()`       | 841-892   |
| `MovieController::getIzisobanuyeMovies()`         | `getIzisobanuyeMoviesAdmin()`    | 894-931   |
| `MovieController::toggleDeleteStatus()`           | `toggleMovieDeleteStatus()`      | 341-357   |
| `MovieController::toggleIzisobanuyeMovieStatus()` | `toggleIzisobanuyeMovieStatus()` | 933-939   |
| `MovieController::incrementViewCount()`           | `incrementMovieViewCount()`      | 359-452   |
| `MovieController::getNotifications()`             | `getNotifications()`             | 487-513   |
| `MovieController::markNotificationAsRead()`       | `markNotificationAsRead()`       | 521-527   |
| `MovieController::markAllNotificationsAsRead()`   | `markAllNotificationsAsRead()`   | 529-552   |
| `MovieController::resetNotifications()`           | `resetNotifications()`           | 593-621   |
| `MovieController::getDashboardStats()`            | `getDashboardStats()`            | 623-636   |
| `MovieController::getReportsData()`               | `getReportsData()`               | 967-1230  |
| `MovieController::getHero()`                      | `getHero()`                      | 1232-1236 |
| `MovieController::storeHero()`                    | `saveHero()`                     | 1238-1280 |
| `CommentController::index()`                      | `getComments()`                  | 12-26     |
| `CommentController::store()`                      | `createComment()`                | 28-54     |
| `CommentController::reply()`                      | `replyToComment()`               | 56-78     |
| `CommentController::adminIndex()`                 | `getAdminComments()`             | 80-137    |
| `CommentController::updateStatus()`               | `updateCommentStatus()`          | 139-146   |
| `CommentController::destroy()`                    | `deleteComment()`                | 148-154   |
| `UserController::index()`                         | `getUsers()`                     | 12-46     |
| `UserController::show()`                          | `getUser()`                      | 48-52     |
| `UserController::update()`                        | `updateUser()`                   | 54-78     |
| `UserController::destroy()`                       | `deleteUser()`                   | 80-92     |
| `UserController::getUserStats()`                  | `getUserStats()`                 | 94-111    |

### Models → TypeScript Interfaces

| Laravel Model               | TypeScript Interface              |
| --------------------------- | --------------------------------- |
| `Movie.php`                 | `Movie` interface                 |
| `IzisobanuyeMovie.php`      | `IzisobanuyeMovie` interface      |
| `Comment.php`               | `Comment` interface               |
| `User.php`                  | `User` interface                  |
| `Hero.php`                  | `Hero` interface                  |
| `MovieViewNotification.php` | `MovieViewNotification` interface |

### Routes Mapping

| Laravel Route              | Next.js Route                       |
| -------------------------- | ----------------------------------- |
| `GET /`                    | `app/page.tsx` (redirects)          |
| `GET /izisobanuye`         | `app/(main)/izisobanuye/page.tsx`   |
| `GET /izidasobanuye`       | `app/(main)/izidasobanuye/page.tsx` |
| `GET /movies/{id}`         | `app/(main)/movies/[id]/page.tsx`   |
| `GET /dashboard`           | `app/(main)/dashboard/page.tsx`     |
| `GET /subscription`        | `app/(main)/subscription/page.tsx`  |
| `GET /admin/dashboard`     | `app/admin/dashboard/page.tsx`      |
| `GET /admin/movies`        | `app/admin/movies/page.tsx`         |
| `GET /admin/users`         | `app/admin/users/page.tsx`          |
| `GET /admin/comments`      | `app/admin/comments/page.tsx`       |
| `GET /admin/notifications` | `app/admin/notifications/page.tsx`  |
| `GET /admin/reports`       | `app/admin/reports/page.tsx`        |
| `GET /admin/settings`      | `app/admin/settings/page.tsx`       |
| `GET /login`               | `app/(auth)/login/page.tsx`         |
| `GET /register`            | `app/(auth)/register/page.tsx`      |
| `GET /settings/profile`    | `app/settings/profile/page.tsx`     |
| `GET /settings/password`   | `app/settings/password/page.tsx`    |
| `GET /settings/appearance` | `app/settings/appearance/page.tsx`  |
| `GET /settings/two-factor` | `app/settings/two-factor/page.tsx`  |

### API Routes Mapping

| Laravel API Route                        | Next.js API Route                        |
| ---------------------------------------- | ---------------------------------------- |
| `GET /api/movies/popular`                | `GET /api/movies/popular`                |
| `GET /api/movies/search`                 | `GET /api/movies/search`                 |
| `GET /api/movies/{id}`                   | `GET /api/movies/[id]`                   |
| `GET /api/comments`                      | `GET /api/comments`                      |
| `POST /api/comments`                     | `POST /api/comments`                     |
| `GET /api/users`                         | `GET /api/users`                         |
| `GET /api/notifications`                 | `GET /api/notifications`                 |
| `POST /api/notifications/{id}/mark-read` | `POST /api/notifications/[id]/mark-read` |

---

## Technology Stack Changes

| Category       | Laravel (Current)  | Next.js (Target)                    |
| -------------- | ------------------ | ----------------------------------- |
| Backend        | PHP 8.2            | Next.js (Server Actions/API Routes) |
| Frontend       | React 19 + Inertia | React 19 + Next.js App Router       |
| Styling        | Tailwind CSS 4     | Tailwind CSS 4                      |
| UI Components  | shadcn/ui (custom) | shadcn/ui (same)                    |
| Database       | SQLite/MySQL       | Same (via Prisma)                   |
| Authentication | Laravel Fortify    | NextAuth.js                         |
| API            | Laravel Routes     | Next.js API Routes                  |
| State          | React Context      | React Context                       |
| Forms          | Laravel Forms      | React Hook Form + Zod               |
| Validation     | Laravel Requests   | Zod schemas                         |

---

## Migration Steps

### Phase 1: Setup & Configuration

1. Initialize Next.js project with TypeScript
2. Configure Tailwind CSS (same as current)
3. Install dependencies (NextAuth, Prisma, React Hook Form, Zod, shadcn/ui)
4. Set up Prisma schema from Laravel migrations

### Phase 2: Backend Logic (Server Actions)

1. Create TypeScript interfaces for all models
2. Convert Laravel controllers to Server Actions
3. Implement authentication with NextAuth.js
4. Create API routes for external integrations (TMDB)

### Phase 3: Frontend Components

1. Copy all UI components (no changes needed)
2. Copy all custom hooks (no changes needed)
3. Copy all contexts (adjust for Next.js)
4. Create layouts in Next.js format

### Phase 4: Pages

1. Convert Inertia pages to Next.js pages
2. Maintain all component imports and props
3. Preserve all comments exactly as they are

### Phase 5: Testing & Verification

1. Test all routes
2. Verify all functionality matches
3. Check performance
4. Ensure all comments are preserved

---

## Preserving Exact Behavior

All the following will be preserved exactly:

- ✅ All PHP comments in controllers
- ✅ All validation logic
- ✅ All error handling
- ✅ All caching logic (using Next.js cache)
- ✅ All pagination logic
- ✅ All filtering and sorting
- ✅ All TMDB API integrations
- ✅ All file upload handling
- ✅ All notification logic
- ✅ All admin checks
- ✅ All role-based access control
- ✅ All two-factor authentication flow
- ✅ All subscription status checks

---

## Performance Considerations

- **SSR**: Next.js provides Server-Side Rendering by default
- **Caching**: Use Next.js `unstable_cache` for TMDB API calls
- **Streaming**: Use React streaming for better TTFB
- **Images**: Use `next/image` for optimized images
- **Static Generation**: Pre-render static pages where possible
