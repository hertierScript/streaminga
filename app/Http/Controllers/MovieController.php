<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\MovieViewNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class MovieController extends Controller
{
    public function popular()
    {
        $data = Cache::remember('tmdb_popular_movies', 3600, function () {
            $apiKey = config('services.tmdb.key');
            $response = Http::get("https://api.themoviedb.org/3/movie/popular", [
                'api_key' => $apiKey,
            ]);

            return $response->successful() ? $response->json() : null;
        });

        return $data ? response()->json($data) : response()->json(['error' => 'Unable to fetch popular movies'], 500);
    }

    public function search(Request $request)
    {
        $query = $request->query('q');
        if (!$query) {
            return response()->json(['error' => 'Query parameter required'], 400);
        }

        $apiKey = config('services.tmdb.key');
        $response = Http::get("https://api.themoviedb.org/3/search/movie", [
            'api_key' => $apiKey,
            'query' => $query,
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json(['error' => 'Unable to search movies'], 500);
    }

    public function show($id)
    {
        $cacheKey = "tmdb_movie_{$id}";
        $data = Cache::remember($cacheKey, 3600, function () use ($id) {
            $apiKey = config('services.tmdb.key');
            $response = Http::get("https://api.themoviedb.org/3/movie/{$id}", [
                'api_key' => $apiKey,
            ]);

            return $response->successful() ? $response->json() : null;
        });

        return $data ? response()->json($data) : response()->json(['error' => 'Movie not found'], 404);
    }

    private function getMoviesByGenre($genreId)
    {
        $cacheKey = "tmdb_movies_genre_{$genreId}";
        $data = Cache::remember($cacheKey, 3600, function () use ($genreId) {
            $apiKey = config('services.tmdb.key');
            $response = Http::get("https://api.themoviedb.org/3/discover/movie", [
                'api_key' => $apiKey,
                'with_genres' => $genreId,
                'sort_by' => 'popularity.desc',
            ]);

            return $response->successful() ? $response->json() : null;
        });

        return $data ? response()->json($data) : response()->json(['error' => 'Unable to fetch movies'], 500);
    }

    public function action()
    {
        return $this->getMoviesByGenre(28);
    }

    public function horror()
    {
        return $this->getMoviesByGenre(27);
    }

    public function comedy()
    {
        return $this->getMoviesByGenre(35);
    }

    public function drama()
    {
        return $this->getMoviesByGenre(18);
    }

    public function romance()
    {
        return $this->getMoviesByGenre(10749);
    }

    public function details($id)
    {
        $cacheKey = "tmdb_movie_details_{$id}";
        $movieData = Cache::remember($cacheKey, 3600, function () use ($id) {
            $apiKey = config('services.tmdb.key');
            $response = Http::get("https://api.themoviedb.org/3/movie/{$id}", [
                'api_key' => $apiKey,
                'append_to_response' => 'credits,videos',
            ]);

            return $response->successful() ? $response->json() : null;
        });

        if ($movieData) {
            $videos = $movieData['videos']['results'] ?? [];
            $trailer = collect($videos)->where('type', 'Trailer')->where('site', 'YouTube')->first();
            $trailerUrl = $trailer ? 'https://www.youtube.com/watch?v=' . $trailer['key'] : null;

            $movie = [
                'id' => $movieData['id'],
                'title' => $movieData['title'],
                'poster' => $movieData['poster_path'] ? 'https://image.tmdb.org/t/p/w500' . $movieData['poster_path'] : null,
                'rating' => $movieData['vote_average'],
                'genre' => collect($movieData['genres'])->pluck('name')->toArray(),
                'description' => $movieData['overview'],
                'releaseYear' => $movieData['release_date'] ? date('Y', strtotime($movieData['release_date'])) : null,
                'duration' => $movieData['runtime'],
                'interpreter' => collect($movieData['credits']['crew'] ?? [])->where('job', 'Director')->pluck('name')->first() ?? 'Unknown',
                'trailer' => $trailerUrl,
            ];

            return Inertia::render('movie-details', ['movie' => $movie]);
        }

        abort(404);
    }

    public function animation()
    {
        return $this->getMoviesByGenre(16);
    }

    public function thriller()
    {
        return $this->getMoviesByGenre(53);
    }

    public function sciFi()
    {
        return $this->getMoviesByGenre(878);
    }

    public function crime()
    {
        return $this->getMoviesByGenre(80);
    }

    public function adventure()
    {
        return $this->getMoviesByGenre(12);
    }

    public function fantasy()
    {
        return $this->getMoviesByGenre(14);
    }

    public function family()
    {
        return $this->getMoviesByGenre(10751);
    }

    // Admin methods for managing movies
    public function getAllMovies(Request $request)
    {
        // First, ensure we have movies from TMDB in the database (only if empty)
        if (Movie::count() === 0) {
            $this->syncMoviesFromTMDB();
        }

        $query = Movie::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        // Genre filter
        if ($request->has('genre') && $request->genre && $request->genre !== 'all') {
            $query->whereJsonContains('genres', $request->genre);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            if ($request->status === 'deleted') {
                $query->where('is_deleted_for_users', true);
            } elseif ($request->status === 'active') {
                $query->where('is_deleted_for_users', false);
            }
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortFields = ['title', 'release_year', 'rating', 'view_count', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        return $query->paginate($perPage);
    }

    private function syncMoviesFromTMDB()
    {
        $apiKey = config('services.tmdb.key');

        // Fetch popular movies
        $this->syncMoviesFromEndpoint("https://api.themoviedb.org/3/movie/popular", $apiKey);

        // Fetch movies by genres
        $genres = [
            28 => 'Action',
            27 => 'Horror',
            35 => 'Comedy',
            18 => 'Drama',
            10749 => 'Romance',
            16 => 'Animation',
            53 => 'Thriller',
            878 => 'Science Fiction',
            80 => 'Crime',
            12 => 'Adventure',
            14 => 'Fantasy',
            10751 => 'Family'
        ];

        foreach ($genres as $genreId => $genreName) {
            $this->syncMoviesFromEndpoint("https://api.themoviedb.org/3/discover/movie?with_genres={$genreId}", $apiKey);
        }
    }

    private function syncMoviesFromEndpoint($url, $apiKey)
    {
        $response = Http::get($url, ['api_key' => $apiKey]);

        if ($response->successful()) {
            $data = $response->json();
            $movies = $data['results'] ?? [];

            foreach ($movies as $movieData) {
                $this->storeMovieFromTMDB($movieData['id']);
            }
        }
    }

    public function toggleDeleteStatus($tmdbId)
    {
        $movie = Movie::where('tmdb_id', $tmdbId)->first();

        if ($movie) {
            $movie->update(['is_deleted_for_users' => !$movie->is_deleted_for_users]);
        } else {
            // If movie doesn't exist in DB, create it first
            $this->storeMovieFromTMDB($tmdbId);
            $movie = Movie::where('tmdb_id', $tmdbId)->first();
            if ($movie) {
                $movie->update(['is_deleted_for_users' => true]);
            }
        }

        return response()->json(['success' => true]);
    }

    public function incrementViewCount($tmdbId)
    {
        $movie = Movie::where('tmdb_id', $tmdbId)->first();

        if (!$movie) {
            // Create movie record if it doesn't exist
            $this->storeMovieFromTMDB($tmdbId);
            $movie = Movie::where('tmdb_id', $tmdbId)->first();
        }

        if ($movie) {
            $watchDuration = request()->input('watch_duration');

            if ($watchDuration) {
                // Update existing notification with duration
                $notification = MovieViewNotification::where('movie_id', $movie->id)
                    ->where('ip_address', request()->ip())
                    ->whereNull('watch_duration')
                    ->latest()
                    ->first();

                if ($notification) {
                    $notification->update(['watch_duration' => $watchDuration]);
                    return response()->json(['success' => true]);
                }
            } else {
                // Increment view count and create notification
                $previousCount = $movie->view_count;
                $movie->increment('view_count');
                $newCount = $movie->view_count;

                // Create notification for admin
                MovieViewNotification::create([
                    'movie_id' => $movie->id,
                    'movie_title' => $movie->title,
                    'previous_view_count' => $previousCount,
                    'new_view_count' => $newCount,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'metadata' => [
                        'referrer' => request()->header('referer'),
                        'timestamp' => now()->toISOString(),
                    ],
                    'watch_duration' => $watchDuration,
                ]);
            }
        }

        return response()->json(['success' => true]);
    }

    private function storeMovieFromTMDB($tmdbId)
    {
        $apiKey = config('services.tmdb.key');
        $response = Http::get("https://api.themoviedb.org/3/movie/{$tmdbId}", [
            'api_key' => $apiKey,
            'append_to_response' => 'credits,videos',
        ]);

        if ($response->successful()) {
            $movieData = $response->json();

            $videos = $movieData['videos']['results'] ?? [];
            $trailer = collect($videos)->where('type', 'Trailer')->where('site', 'YouTube')->first();
            $trailerUrl = $trailer ? 'https://www.youtube.com/watch?v=' . $trailer['key'] : null;

            Movie::updateOrCreate(
                ['tmdb_id' => $tmdbId],
                [
                    'title' => $movieData['title'],
                    'description' => $movieData['overview'],
                    'poster_path' => $movieData['poster_path'],
                    'rating' => $movieData['vote_average'],
                    'genres' => collect($movieData['genres'])->pluck('name')->toArray(),
                    'release_year' => $movieData['release_date'] ? date('Y', strtotime($movieData['release_date'])) : null,
                    'duration' => $movieData['runtime'],
                    'interpreter' => collect($movieData['credits']['crew'] ?? [])->where('job', 'Director')->pluck('name')->first() ?? 'Unknown',
                    'trailer_url' => $trailerUrl,
                ]
            );
        }
    }

    // Notification methods
    public function getNotifications(Request $request)
    {
        $notifications = MovieViewNotification::with('movie')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notifications);
    }

    public function getUnreadNotificationCount()
    {
        $count = MovieViewNotification::unread()->count();
        return response()->json(['count' => $count]);
    }

    public function markNotificationAsRead($notificationId)
    {
        $notification = MovieViewNotification::findOrFail($notificationId);
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllNotificationsAsRead()
    {
        MovieViewNotification::unread()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function getWatchDurationStats()
    {
        $totalDuration = MovieViewNotification::whereNotNull('watch_duration')->sum('watch_duration');
        $averageDuration = MovieViewNotification::whereNotNull('watch_duration')->avg('watch_duration');
        $totalViewsWithDuration = MovieViewNotification::whereNotNull('watch_duration')->count();

        return response()->json([
            'total_duration' => $totalDuration,
            'average_duration' => round($averageDuration, 2),
            'total_views_with_duration' => $totalViewsWithDuration,
        ]);
    }

    public function getTotalWatchDurationForUntranslatedMovies()
    {
        // Since there's no specific "untranslated" field, we'll sum watch duration for all movies
        // Assuming "untranslated movies" means all movies in the system
        $totalDuration = MovieViewNotification::whereNotNull('watch_duration')->sum('watch_duration');

        return response()->json([
            'total_duration' => $totalDuration,
        ]);
    }

    public function resetNotifications()
    {
        MovieViewNotification::truncate();

        return response()->json(['success' => true, 'message' => 'Notifications reset successfully']);
    }
}
