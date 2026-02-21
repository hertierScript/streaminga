<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::location('/izidasobanuye');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        // Check user's role from database
        $role = $user->role;

        if ($role === 'admin' || $role === 'super_admin') {
            // Redirect admin to admin dashboard
            return redirect()->route('admin.dashboard');
        } else {
            // End users are redirected to the movie browsing page
            return redirect('/izisobanuye');
        }
    })->name('dashboard');

    Route::get('admin-dashboard', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->middleware('admin')->name('admin.dashboard');

    Route::get('admin/notifications', function () {
        return Inertia::render('admin/movie-notifications');
    })->name('admin.notifications');

    Route::get('admin/notifications/translated', function () {
        return Inertia::render('admin/movie-notifications');
    })->name('admin.notifications.translated');

    Route::get('admin/notifications/untranslated', function () {
        return Inertia::render('admin/movie-notifications');
    })->name('admin.notifications.untranslated');

    Route::get('admin/notifications/read', function () {
        return Inertia::render('admin/movie-notifications');
    })->name('admin.notifications.read');

    Route::get('admin/movies', function () {
        return Inertia::render('admin/movies');
    })->name('admin.movies');

    Route::get('admin/untranslated-movies', function () {
        return Inertia::render('admin/untranslated-movies');
    })->name('admin.untranslated-movies');

    Route::get('admin/comments', function () {
        return Inertia::render('admin/comments');
    })->name('admin.comments');

    Route::get('admin/users', function () {
        return Inertia::render('admin/users');
    })->name('admin.users');


    Route::get('admin/analytics', function () {
        return Inertia::render('admin/analytics');
    })->name('admin.analytics');

    Route::get('admin/subscriptions', function () {
        return Inertia::render('admin/subscriptions');
    })->name('admin.subscriptions');

    Route::get('admin/reports', function (Illuminate\Http\Request $request) {
        $timeRange = $request->get('time_range', '30d');
        $reportsData = app(\App\Http\Controllers\MovieController::class)->getReportsData($request)->getData();
        return Inertia::render('admin/reports', [
            'reportsData' => $reportsData,
            'timeRange' => $timeRange
        ]);
    })->middleware('admin')->name('admin.reports');

    Route::get('admin/hero', function () {
        return Inertia::render('admin/hero');
    })->name('admin.hero');

    Route::get('admin/settings', function () {
        return Inertia::render('admin/settings');
    })->middleware('admin')->name('admin.settings');

    Route::get('subscription', function () {
        return Inertia::render('subscription');
    })->name('subscription');
});

Route::get('izisobanuye', function () {
    // Cache the izisobanuye page data for 5 minutes
    $cacheKey = 'izisobanuye_page_data';
    
    $data = Cache::remember($cacheKey, 300, function () {
        $movies = App\Models\IzisobanuyeMovie::where('is_deleted_for_users', false)
            ->orderBy('created_at', 'desc')
            ->select(['id', 'title', 'poster_file_path', 'poster_path', 'rating', 'genres', 'description', 'release_year', 'duration', 'interpreter', 'trailer_url', 'movie_file_path'])
            ->get()
            ->map(function ($movie) {
                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'poster' => $movie->poster_file_path ?: ($movie->poster_path ? 'https://image.tmdb.org/t/p/w500' . $movie->poster_path : '/Images/default-movie.jpg'),
                    'rating' => $movie->rating,
                    'genre' => $movie->genres ?? [],
                    'description' => $movie->description,
                    'releaseYear' => $movie->release_year,
                    'duration' => $movie->duration,
                    'interpreter' => $movie->interpreter,
                    'trailer' => $movie->trailer_url,
                    'poster_file_path' => $movie->poster_file_path,
                    'movie_file_path' => $movie->movie_file_path,
                    'category' => 'izisobanuye',
                ];
            });

        $hero = App\Models\Hero::first();

        if ($hero) {
            $hero = [
                'id' => 'hero',
                'title' => $hero->title,
                'poster' => $hero->poster_path ? '/storage/' . $hero->poster_path : '/Images/default-movie.jpg',
                'rating' => 0,
                'genre' => $hero->genre ? [$hero->genre] : [],
                'description' => $hero->overview,
                'releaseYear' => $hero->release_year,
                'duration' => 0,
                'interpreter' => null,
                'trailer' => $hero->watch_trailer_url,
                'poster_file_path' => $hero->poster_path,
                'movie_file_path' => null,
                'category' => 'hero',
                'watch_now_url' => $hero->watch_now_url,
            ];
        }
        
        return ['movies' => $movies, 'hero' => $hero];
    });

    return Inertia::render('izisobanuye', ['movies' => $data['movies'], 'hero' => $data['hero']]);
})->name('izisobanuye');

Route::get('api/movies/homepage', [App\Http\Controllers\MovieController::class, 'homepageMovies'])->name('movies.homepage');
Route::get('api/movies/original', [App\Http\Controllers\MovieController::class, 'originalMovies'])->name('movies.original');

Route::get('izidasobanuye', function () {
    // Cache the izidasobanuye page for 5 minutes
    return Cache::remember('izidasobanuye_page', 300, function () {
        return Inertia::render('izidasobanuye');
    });
})->name('izidasobanuye');

// Category page with movies by genre
Route::get('category/{category}', function (Illuminate\Http\Request $request, $category) {
    // Map URL slugs to display labels
    $labels = [
        'popular' => 'Popular',
        'action' => 'Action',
        'horror' => 'Horror',
        'comedy' => 'Comedy',
        'drama' => 'Drama',
        'romance' => 'Romance',
        'animation' => 'Animation',
        'thriller' => 'Thriller',
        'sci-fi' => 'Science Fiction',
        'crime' => 'Crime',
        'adventure' => 'Adventure',
        'fantasy' => 'Fantasy',
        'family' => 'Family',
    ];
    
    $label = $labels[$category] ?? ucfirst($category);
    $apiKey = config('services.tmdb.key');
    $page = $request->query('page', 1);
    
    return Inertia::render('category', [
        'category' => $category,
        'categoryLabel' => $label,
        'tmdbApiKey' => $apiKey,
        'initialPage' => (int) $page,
    ]);
})->name('category');

// Debug route to check auth status
Route::get('auth-status', function () {
    return response()->json([
        'authenticated' => auth()->check(),
        'user' => auth()->user(),
        'session_id' => session()->getId()
    ]);
})->name('auth.status');

// Test route to automatically login as admin for testing purposes
Route::get('test-login', function () {
    $user = \App\Models\User::where('email', 'hertiermunyaka047@gmail.com')->first();
    if ($user) {
        auth()->login($user);
        return redirect()->route('admin.movies');
    }
    return response()->json(['error' => 'Admin user not found'], 404);
});

// Sanctum API routes
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return $request->user();
});

// CSRF cookie route for SPA authentication
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
})->middleware('web');

Route::get('watch/{id}', [App\Http\Controllers\MovieController::class, 'watch'])->name('watch');
Route::get('movies/{id}', [App\Http\Controllers\MovieController::class, 'details'])->name('movies.show');
Route::get('static-movies/{id}', [App\Http\Controllers\MovieController::class, 'staticMovieDetails'])->name('static-movies.show');

// Comment routes
Route::get('api/comments', [App\Http\Controllers\CommentController::class, 'index']);
Route::post('api/comments', [App\Http\Controllers\CommentController::class, 'store']);
Route::middleware(['auth'])->group(function () {
    Route::post('api/comments/{comment}/reply', [App\Http\Controllers\CommentController::class, 'reply']);
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('api/comments', [App\Http\Controllers\CommentController::class, 'adminIndex']);
    Route::patch('api/comments/{comment}/status', [App\Http\Controllers\CommentController::class, 'updateStatus']);
    Route::delete('api/comments/{comment}', [App\Http\Controllers\CommentController::class, 'destroy']);
    Route::post('api/comments/{comment}/reply', [App\Http\Controllers\CommentController::class, 'reply']);
});

// Movie API routes
Route::get('api/movies/popular', [App\Http\Controllers\MovieController::class, 'popular']);
Route::get('api/movies/search', [App\Http\Controllers\MovieController::class, 'search']);
Route::get('api/movies/{id}', [App\Http\Controllers\MovieController::class, 'show']);
Route::get('api/movies/genre/action', [App\Http\Controllers\MovieController::class, 'action']);
Route::get('api/movies/genre/horror', [App\Http\Controllers\MovieController::class, 'horror']);
Route::get('api/movies/genre/comedy', [App\Http\Controllers\MovieController::class, 'comedy']);
Route::get('api/movies/genre/drama', [App\Http\Controllers\MovieController::class, 'drama']);
Route::get('api/movies/genre/romance', [App\Http\Controllers\MovieController::class, 'romance']);
Route::get('api/movies/genre/animation', [App\Http\Controllers\MovieController::class, 'animation']);
Route::get('api/movies/genre/thriller', [App\Http\Controllers\MovieController::class, 'thriller']);
Route::get('api/movies/genre/sci-fi', [App\Http\Controllers\MovieController::class, 'sciFi']);
Route::get('api/movies/genre/crime', [App\Http\Controllers\MovieController::class, 'crime']);
Route::get('api/movies/genre/adventure', [App\Http\Controllers\MovieController::class, 'adventure']);
Route::get('api/movies/genre/fantasy', [App\Http\Controllers\MovieController::class, 'fantasy']);
Route::get('api/movies/genre/family', [App\Http\Controllers\MovieController::class, 'family']);

// Admin movie management routes
Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Original movies (izidasobanuye)
    Route::get('api/movies', [App\Http\Controllers\MovieController::class, 'getAllMovies']);
    Route::post('api/movies', [App\Http\Controllers\MovieController::class, 'store'])->middleware('admin');
    Route::post('api/movies/{tmdbId}/toggle-delete', [App\Http\Controllers\MovieController::class, 'toggleDeleteStatus'])->middleware('admin');
    Route::post('api/movies/{tmdbId}/increment-view', [App\Http\Controllers\MovieController::class, 'incrementViewCount']);

    // Izisobanuye movies
    Route::get('api/izisobanuye-movies', [App\Http\Controllers\MovieController::class, 'getIzisobanuyeMovies']);
    Route::post('api/izisobanuye-movies', [App\Http\Controllers\MovieController::class, 'storeIzisobanuyeMovie'])->middleware('admin');
    Route::post('api/izisobanuye-movies/{id}/toggle-delete', [App\Http\Controllers\MovieController::class, 'toggleIzisobanuyeMovieStatus'])->middleware('admin');

    // Notification routes
    Route::get('api/notifications', [App\Http\Controllers\MovieController::class, 'getNotifications']);
    Route::get('api/notifications/unread-count', [App\Http\Controllers\MovieController::class, 'getUnreadNotificationCount']);
    Route::post('api/notifications/{notificationId}/mark-read', [App\Http\Controllers\MovieController::class, 'markNotificationAsRead']);
    Route::post('api/notifications/mark-all-read', [App\Http\Controllers\MovieController::class, 'markAllNotificationsAsRead']);
    Route::post('api/notifications/reset', [App\Http\Controllers\MovieController::class, 'resetNotifications']);
    Route::get('api/watch-duration-stats', [App\Http\Controllers\MovieController::class, 'getWatchDurationStats']);
    Route::get('api/total-watch-duration-untranslated', [App\Http\Controllers\MovieController::class, 'getTotalWatchDurationForUntranslatedMovies']);
    Route::get('api/total-watch-duration-translated', [App\Http\Controllers\MovieController::class, 'getTotalWatchDurationForTranslatedMovies']);
    Route::get('api/dashboard-stats', [App\Http\Controllers\MovieController::class, 'getDashboardStats']);
    Route::get('api/recent-activities', [App\Http\Controllers\MovieController::class, 'getRecentActivities']);
    Route::get('api/top-performing-movies', [App\Http\Controllers\MovieController::class, 'getTopPerformingMovies']);
    Route::get('api/recent-izisobanuye-movies', [App\Http\Controllers\MovieController::class, 'getRecentIzisobanuyeMovies']);
    Route::get('api/recent-untranslated-movies', [App\Http\Controllers\MovieController::class, 'getRecentUntranslatedMovies']);
    Route::get('api/untranslated-movies', [App\Http\Controllers\MovieController::class, 'getPaginatedUntranslatedMovies']);
    Route::get('api/movie-counts', [App\Http\Controllers\MovieController::class, 'getMovieCounts']);
    Route::get('api/notification-counts', [App\Http\Controllers\MovieController::class, 'getNotificationCounts']);
    Route::get('api/reports-data', [App\Http\Controllers\MovieController::class, 'getReportsData']);

    // Hero management
    Route::get('api/hero', [App\Http\Controllers\MovieController::class, 'getHero'])->middleware('admin');
    Route::post('api/hero', [App\Http\Controllers\MovieController::class, 'storeHero'])->middleware('admin');

    // User management routes
    Route::get('api/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::get('api/users/{id}', [App\Http\Controllers\UserController::class, 'show']);
    Route::put('api/users/{id}', [App\Http\Controllers\UserController::class, 'update']);
    Route::delete('api/users/{id}', [App\Http\Controllers\UserController::class, 'destroy']);
    Route::get('api/user-stats', [App\Http\Controllers\UserController::class, 'getUserStats']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
