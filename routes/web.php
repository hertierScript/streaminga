<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('izidasobanuye');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        // Mock role logic - in real app, check user's role from database
        $role = $user->role ?? 'admin'; // Default to admin for testing

        if ($role === 'admin') {
            return Inertia::render('admin/dashboard');
        } else {
            return Inertia::render('subscription');
        }
    })->name('dashboard');

    Route::get('admin-dashboard', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::get('admin/notifications', function () {
        return Inertia::render('admin/notifications');
    })->name('admin.notifications');

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

    Route::get('admin/end-users', function () {
        return Inertia::render('admin/end-users');
    })->name('admin.end-users');

    Route::get('admin/admin-users', function () {
        return Inertia::render('admin/admin-users');
    })->name('admin.admin-users');

    Route::get('admin/analytics', function () {
        return Inertia::render('admin/analytics');
    })->name('admin.analytics');

    Route::get('admin/subscriptions', function () {
        return Inertia::render('admin/subscriptions');
    })->name('admin.subscriptions');

    Route::get('admin/reports', function () {
        return Inertia::render('admin/reports');
    })->name('admin.reports');

    Route::get('admin/settings', function () {
        return Inertia::render('admin/settings');
    })->name('admin.settings');

    Route::get('subscription', function () {
        return Inertia::render('subscription');
    })->name('subscription');
});

Route::get('izisobanuye', function () {
    return Inertia::render('izisobanuye');
})->name('izisobanuye');

Route::get('izidasobanuye', function () {
    return Inertia::render('izidasobanuye');
})->name('izidasobanuye');

Route::get('movies/{id}', [App\Http\Controllers\MovieController::class, 'details'])->name('movies.show');

// Comment routes
Route::middleware(['auth'])->group(function () {
    Route::get('api/comments', [App\Http\Controllers\CommentController::class, 'index']);
    Route::post('api/comments', [App\Http\Controllers\CommentController::class, 'store']);
    Route::post('api/comments/{comment}/reply', [App\Http\Controllers\CommentController::class, 'reply']);
});

Route::middleware(['auth'])->prefix('admin')->group(function () {
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
    Route::get('api/movies', [App\Http\Controllers\MovieController::class, 'getAllMovies']);
    Route::post('api/movies/{tmdbId}/toggle-delete', [App\Http\Controllers\MovieController::class, 'toggleDeleteStatus']);
    Route::post('api/movies/{tmdbId}/increment-view', [App\Http\Controllers\MovieController::class, 'incrementViewCount']);

    // Notification routes
    Route::get('api/notifications', [App\Http\Controllers\MovieController::class, 'getNotifications']);
    Route::get('api/notifications/unread-count', [App\Http\Controllers\MovieController::class, 'getUnreadNotificationCount']);
    Route::post('api/notifications/{notificationId}/mark-read', [App\Http\Controllers\MovieController::class, 'markNotificationAsRead']);
    Route::post('api/notifications/mark-all-read', [App\Http\Controllers\MovieController::class, 'markAllNotificationsAsRead']);
    Route::post('api/notifications/reset', [App\Http\Controllers\MovieController::class, 'resetNotifications']);
    Route::get('api/watch-duration-stats', [App\Http\Controllers\MovieController::class, 'getWatchDurationStats']);
    Route::get('api/total-watch-duration-untranslated', [App\Http\Controllers\MovieController::class, 'getTotalWatchDurationForUntranslatedMovies']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
