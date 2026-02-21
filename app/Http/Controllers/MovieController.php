<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\IzisobanuyeMovie;
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
        $page = $request->query('page', 1);
        
        if (!$query) {
            return response()->json(['error' => 'Query parameter required'], 400);
        }
        
        $apiKey = config('services.tmdb.key');
        $response = Http::get("https://api.themoviedb.org/3/search/movie", [
            'api_key' => $apiKey,
            'query' => $query,
            'page' => $page,
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

    public function watch($id)
    {
        // First, try to get izisobanuye movie from database
        $izisobanuyeMovie = IzisobanuyeMovie::find($id);

        if ($izisobanuyeMovie) {
            // This is an izisobanuye movie
            $movie = [
                'id' => $izisobanuyeMovie->id,
                'title' => $izisobanuyeMovie->title,
                'poster' => $izisobanuyeMovie->poster_file_path ?: ($izisobanuyeMovie->poster_path ? 'https://image.tmdb.org/t/p/w500' . $izisobanuyeMovie->poster_path : '/Images/default-movie.jpg'),
                'rating' => $izisobanuyeMovie->rating,
                'genre' => $izisobanuyeMovie->genres ?? [],
                'description' => $izisobanuyeMovie->description,
                'releaseYear' => $izisobanuyeMovie->release_year,
                'duration' => $izisobanuyeMovie->duration,
                'interpreter' => $izisobanuyeMovie->interpreter,
                'trailer' => $izisobanuyeMovie->trailer_url,
                'poster_file_path' => $izisobanuyeMovie->poster_file_path,
                'movie_file_path' => $izisobanuyeMovie->movie_file_path,
            ];

            return Inertia::render('watch-movie', ['movie' => $movie]);
        }

        // Then, try to get movie from database (for TMDB movies)
        $movieRecord = Movie::where('tmdb_id', $id)->first();

        if ($movieRecord) {
            // This is a TMDB movie stored in database
            $movie = [
                'id' => $movieRecord->tmdb_id,
                'title' => $movieRecord->title,
                'poster' => $movieRecord->poster_file_path ?: ($movieRecord->poster_path ? 'https://image.tmdb.org/t/p/w500' . $movieRecord->poster_path : '/Images/default-movie.jpg'),
                'rating' => $movieRecord->rating,
                'genre' => $movieRecord->genres ?? [],
                'description' => $movieRecord->description,
                'releaseYear' => $movieRecord->release_year,
                'duration' => $movieRecord->duration,
                'interpreter' => $movieRecord->interpreter,
                'trailer' => $movieRecord->trailer_url,
                'poster_file_path' => $movieRecord->poster_file_path,
                'movie_file_path' => $movieRecord->movie_file_path,
            ];

            return Inertia::render('watch-movie', ['movie' => $movie]);
        }

        // If not in database, try to fetch from TMDB API and store in database
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
                'poster' => $movieData['poster_path'] ? 'https://image.tmdb.org/t/p/w500' . $movieData['poster_path'] : '/Images/default-movie.jpg',
                'rating' => $movieData['vote_average'],
                'genre' => collect($movieData['genres'])->pluck('name')->toArray(),
                'description' => $movieData['overview'],
                'releaseYear' => $movieData['release_date'] ? date('Y', strtotime($movieData['release_date'])) : null,
                'duration' => $movieData['runtime'],
                'interpreter' => collect($movieData['credits']['crew'] ?? [])->where('job', 'Director')->pluck('name')->first() ?? 'Unknown',
                'trailer' => $trailerUrl,
            ];

            // Store movie in database asynchronously for faster future access
            dispatch(function () use ($id) {
                $this->storeMovieFromTMDB($id);
            })->afterResponse();

            return Inertia::render('watch-movie', ['movie' => $movie]);
        }

        abort(404);
    }

    public function details($id)
    {
        // First, try to get izisobanuye movie from database
        $izisobanuyeMovie = IzisobanuyeMovie::find($id);

        if ($izisobanuyeMovie) {
            // This is an izisobanuye movie
            $movie = [
                'id' => $izisobanuyeMovie->id,
                'title' => $izisobanuyeMovie->title,
                'poster' => $izisobanuyeMovie->poster_file_path ?: ($izisobanuyeMovie->poster_path ? 'https://image.tmdb.org/t/p/w500' . $izisobanuyeMovie->poster_path : '/Images/default-movie.jpg'),
                'rating' => $izisobanuyeMovie->rating,
                'genre' => $izisobanuyeMovie->genres ?? [],
                'description' => $izisobanuyeMovie->description,
                'releaseYear' => $izisobanuyeMovie->release_year,
                'duration' => $izisobanuyeMovie->duration,
                'interpreter' => $izisobanuyeMovie->interpreter,
                'trailer' => $izisobanuyeMovie->trailer_url,
                'poster_file_path' => $izisobanuyeMovie->poster_file_path,
                'movie_file_path' => $izisobanuyeMovie->movie_file_path,
            ];

            return Inertia::render('izisobanuye-movie-details', ['movie' => $movie]);
        }

        // Then, try to get movie from database (for TMDB movies)
        $movieRecord = Movie::where('tmdb_id', $id)->first();

        if ($movieRecord) {
            // This is a TMDB movie stored in database
            $movie = [
                'id' => $movieRecord->tmdb_id,
                'title' => $movieRecord->title,
                'poster' => $movieRecord->poster_file_path ?: ($movieRecord->poster_path ? 'https://image.tmdb.org/t/p/w500' . $movieRecord->poster_path : '/Images/default-movie.jpg'),
                'rating' => $movieRecord->rating,
                'genre' => $movieRecord->genres ?? [],
                'description' => $movieRecord->description,
                'releaseYear' => $movieRecord->release_year,
                'duration' => $movieRecord->duration,
                'interpreter' => $movieRecord->interpreter,
                'trailer' => $movieRecord->trailer_url,
                'poster_file_path' => $movieRecord->poster_file_path,
                'movie_file_path' => $movieRecord->movie_file_path,
            ];

            return Inertia::render('movie-details', ['movie' => $movie]);
        }

        // If not in database, try to fetch from TMDB API and store in database
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
                'poster' => $movieData['poster_path'] ? 'https://image.tmdb.org/t/p/w500' . $movieData['poster_path'] : '/Images/default-movie.jpg',
                'rating' => $movieData['vote_average'],
                'genre' => collect($movieData['genres'])->pluck('name')->toArray(),
                'description' => $movieData['overview'],
                'releaseYear' => $movieData['release_date'] ? date('Y', strtotime($movieData['release_date'])) : null,
                'duration' => $movieData['runtime'],
                'interpreter' => collect($movieData['credits']['crew'] ?? [])->where('job', 'Director')->pluck('name')->first() ?? 'Unknown',
                'trailer' => $trailerUrl,
            ];

            // Store movie in database asynchronously for faster future access
            dispatch(function () use ($id) {
                $this->storeMovieFromTMDB($id);
            })->afterResponse();

            return Inertia::render('movie-details', ['movie' => $movie]);
        }

        abort(404);
    }

    public function staticMovieDetails($id)
    {
        // Load static movies data
        $staticMovies = [
            1 => ['id' => 1, 'title' => 'Inception', 'poster' => '/Images/back_in_action.jpg', 'rating' => 8.8, 'genre' => ['Action', 'Sci-Fi', 'Thriller'], 'description' => 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'releaseYear' => 2010, 'duration' => 148, 'interpreter' => 'Christopher Nolan', 'trailer' => null, 'category' => 'Movie'],
            2 => ['id' => 2, 'title' => 'The Dark Knight', 'poster' => '/Images/beauty_in_black.jpg', 'rating' => 9.0, 'genre' => ['Action', 'Crime', 'Drama'], 'description' => 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'releaseYear' => 2008, 'duration' => 152, 'interpreter' => 'Christopher Nolan', 'trailer' => null, 'category' => 'Movie'],
            3 => ['id' => 3, 'title' => 'Interstellar', 'poster' => '/Images/forty_seven_ronin.jpg', 'rating' => 8.6, 'genre' => ['Adventure', 'Drama', 'Sci-Fi'], 'description' => 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 'releaseYear' => 2014, 'duration' => 169, 'interpreter' => 'Christopher Nolan', 'trailer' => null, 'category' => 'Movie'],
            4 => ['id' => 4, 'title' => 'The Matrix', 'poster' => '/Images/man_from_toronto.jpg', 'rating' => 8.7, 'genre' => ['Action', 'Sci-Fi'], 'description' => 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 'releaseYear' => 1999, 'duration' => 136, 'interpreter' => 'Wachowski Sisters', 'trailer' => null, 'category' => 'Movie'],
            5 => ['id' => 5, 'title' => 'Avengers: Endgame', 'poster' => '/Images/sinners_ver4.jpg', 'rating' => 8.4, 'genre' => ['Action', 'Adventure', 'Drama'], 'description' => 'After the devastating events of Avengers: Infinity War, the universe is in ruins.', 'releaseYear' => 2019, 'duration' => 181, 'interpreter' => 'Anthony Russo & Joe Russo', 'trailer' => null, 'category' => 'Movie'],
            6 => ['id' => 6, 'title' => 'Dune: Part Two', 'poster' => '/Images/vikings.jpg', 'rating' => 8.5, 'genre' => ['Action', 'Adventure', 'Drama'], 'description' => 'Paul Atreides unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.', 'releaseYear' => 2024, 'duration' => 166, 'interpreter' => 'Denis Villeneuve', 'trailer' => null, 'category' => 'Movie'],
            7 => ['id' => 7, 'title' => 'Oppenheimer', 'poster' => '/Images/back_in_action.jpg', 'rating' => 8.3, 'genre' => ['Biography', 'Drama', 'History'], 'description' => 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 'releaseYear' => 2023, 'duration' => 180, 'interpreter' => 'Christopher Nolan', 'trailer' => null, 'category' => 'Movie'],
            8 => ['id' => 8, 'title' => 'Barbie', 'poster' => '/Images/beauty_in_black.jpg', 'rating' => 6.9, 'genre' => ['Adventure', 'Comedy', 'Fantasy'], 'description' => 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.', 'releaseYear' => 2023, 'duration' => 114, 'interpreter' => 'Greta Gerwig', 'trailer' => null, 'category' => 'Movie'],
            9 => ['id' => 9, 'title' => 'Poor Things', 'poster' => '/Images/forty_seven_ronin.jpg', 'rating' => 8.1, 'genre' => ['Comedy', 'Drama', 'Romance'], 'description' => 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.', 'releaseYear' => 2023, 'duration' => 141, 'interpreter' => 'Yorgos Lanthimos', 'trailer' => null, 'category' => 'Movie'],
            10 => ['id' => 10, 'title' => 'The Holdovers', 'poster' => '/Images/man_from_toronto.jpg', 'rating' => 8.0, 'genre' => ['Comedy', 'Drama'], 'description' => 'A curmudgeonly instructor at a New England prep school is forced to remain on campus during Christmas break to babysit the handful of students with nowhere to go.', 'releaseYear' => 2023, 'duration' => 133, 'interpreter' => 'Alexander Payne', 'trailer' => null, 'category' => 'Movie'],
            // Add more as needed...
        ];

        if (isset($staticMovies[$id])) {
            return Inertia::render('movie-details', ['movie' => $staticMovies[$id]]);
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
        $perPage = $request->get('per_page', 100);
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

    public function incrementViewCount($id)
    {
        // First check if it's an izisobanuye movie
        $izisobanuyeMovie = IzisobanuyeMovie::find($id);

        if ($izisobanuyeMovie) {
            $watchDuration = request()->input('watch_duration');

            if ($watchDuration) {
                // Update existing notification with duration
                $notification = MovieViewNotification::where('izisobanuye_movie_id', $izisobanuyeMovie->id)
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
                $previousCount = $izisobanuyeMovie->view_count;
                $izisobanuyeMovie->increment('view_count');
                $newCount = $izisobanuyeMovie->view_count;

                // Create notification for admin
                MovieViewNotification::create([
                    'izisobanuye_movie_id' => $izisobanuyeMovie->id,
                    'movie_title' => $izisobanuyeMovie->title,
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

            return response()->json(['success' => true]);
        }

        // Handle TMDB movies
        $movie = Movie::where('tmdb_id', $id)->first();

        if (!$movie) {
            // Create movie record if it doesn't exist
            $this->storeMovieFromTMDB($id);
            $movie = Movie::where('tmdb_id', $id)->first();
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
        $query = MovieViewNotification::with(['movie', 'izisobanuyeMovie']);

        // Filter by type if specified
        if ($request->has('type') && $request->type) {
            if ($request->type === 'translated') {
                $query->whereHas('movie', function ($q) {
                    $q->where('is_deleted_for_users', false);
                })->whereNull('izisobanuye_movie_id');
            } elseif ($request->type === 'untranslated') {
                $query->whereHas('movie', function ($q) {
                    $q->where('is_deleted_for_users', true);
                })->whereNull('izisobanuye_movie_id');
            } elseif ($request->type === 'izisobanuye') {
                $query->whereNotNull('izisobanuye_movie_id');
            } elseif ($request->type === 'read') {
                $query->where('is_read', true);
            } elseif ($request->type === 'unread') {
                $query->where('is_read', false);
            }
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(20);

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

    public function markAllNotificationsAsRead(Request $request)
    {
        $query = MovieViewNotification::unread();

        // Filter by type if specified
        if ($request->has('type') && $request->type) {
            if ($request->type === 'translated') {
                $query->whereHas('movie', function ($q) {
                    $q->where('is_deleted_for_users', false);
                });
            } elseif ($request->type === 'untranslated') {
                $query->whereHas('movie', function ($q) {
                    $q->where('is_deleted_for_users', true);
                });
            }
        }

        $query->update([
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
        $totalDuration = MovieViewNotification::whereNotNull('watch_duration')
            ->whereHas('movie', function ($query) {
                $query->where('is_deleted_for_users', true);
            })
            ->sum('watch_duration');

        return response()->json([
            'total_duration' => $totalDuration,
        ]);
    }

    public function getTotalWatchDurationForTranslatedMovies()
    {
        $totalDuration = MovieViewNotification::whereNotNull('watch_duration')
            ->whereHas('movie', function ($query) {
                $query->where('is_deleted_for_users', false);
            })
            ->sum('watch_duration');

        return response()->json([
            'total_duration' => $totalDuration,
        ]);
    }

    public function resetNotifications(Request $request)
    {
        $query = MovieViewNotification::query();

        // Filter by type if specified
        if ($request->has('type') && $request->type) {
            if ($request->type === 'translated') {
                $query->whereHas('movie', function ($q) {
                    $q->where('is_deleted_for_users', false);
                });
            } elseif ($request->type === 'untranslated') {
                $query->whereHas('movie', function ($q) {
                    $q->where('is_deleted_for_users', true);
                });
            }
        }

        if ($request->has('type') && $request->type) {
            // Delete only filtered notifications
            $query->delete();
            $message = ucfirst($request->type) . ' movie notifications reset successfully';
        } else {
            // Delete all notifications
            MovieViewNotification::truncate();
            $message = 'All notifications reset successfully';
        }

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function getDashboardStats()
    {
        // Get izidasobanuye (untranslated) movies count from TMDB API
        // These are fetched from the TMDB API and represent untranslated content
        $apiKey = config('services.tmdb.key');
        
        // Cache the TMDB response for 1 hour
        $totalUntranslated = Cache::remember('tmdb_untranslated_count', 3600, function () use ($apiKey) {
            // Fetch from multiple TMDB endpoints to get total untranslated movies
            $total = 0;
            
            // Get popular movies count from TMDB
            $popularResponse = Http::get("https://api.themoviedb.org/3/movie/popular", [
                'api_key' => $apiKey,
            ]);
            if ($popularResponse->successful()) {
                $popularData = $popularResponse->json();
                $total = $popularData['total_results'] ?? 0;
            }
            
            return $total;
        });
        
        // Get izidasobanuye (untranslated) views from MovieViewNotification (movies with is_deleted_for_users = true)
        $untranslatedViews = MovieViewNotification::whereHas('movie', function ($query) {
            $query->where('is_deleted_for_users', true);
        })->count();
        
        // Also get view counts from Movie table for both translated and untranslated
        $movieViewCount = Movie::sum('view_count');
        
        // Get izisobanuye movies count (local content from database)
        $izisobanuyeMovieCount = IzisobanuyeMovie::where('is_deleted_for_users', false)->count();
        $izisobanuyeViews = IzisobanuyeMovie::where('is_deleted_for_users', false)->sum('view_count');

        // Total movies in the whole system (TMDB + local)
        $totalMovies = $totalUntranslated + $izisobanuyeMovieCount;

        // Total watch time in seconds
        $totalWatchTime = MovieViewNotification::whereNotNull('watch_duration')->sum('watch_duration');

        // Comments count
        $totalComments = \App\Models\Comment::count();

        // Total subscribers (real data)
        $totalSubscribers = \App\Models\User::where('subscription_status', 'active')->count();

        // Revenue from active subscriptions
        $revenue = \App\Models\User::where('subscription_status', 'active')->count() * 5000; // Assuming 5000 RWF per subscription

        return response()->json([
            'untranslated_views' => $untranslatedViews,
            'untranslated_movie_count' => $totalUntranslated,
            'translated_views' => 0,
            'translated_movie_count' => 0,
            'izisobanuye_views' => $izisobanuyeViews,
            'izisobanuye_movie_count' => $izisobanuyeMovieCount,
            'total_views' => $untranslatedViews + $izisobanuyeViews + $movieViewCount,
            'total_comments' => $totalComments,
            'total_subscribers' => $totalSubscribers,
            'revenue' => $revenue,
            'total_movies' => $totalMovies,
            'total_watch_time' => $totalWatchTime,
        ]);
    }

    public function getRecentActivities()
    {
        $activities = [];
        
        // Get recent movie view notifications (real data) - optimized with select
        $movieViews = MovieViewNotification::orderBy('created_at', 'desc')
            ->select(['id', 'movie_title', 'created_at'])
            ->take(5)
            ->get();
        foreach ($movieViews as $notification) {
            $activities[] = [
                'id' => 'view_' . $notification->id,
                'type' => 'movie_view',
                'message' => "Movie \"{$notification->movie_title}\" was watched",
                'timestamp' => $notification->created_at->diffForHumans(),
                'created_at' => $notification->created_at,
                'icon' => 'play',
            ];
        }
        
        // Get recent user registrations (real data from users table) - optimized with select
        $recentUsers = \App\Models\User::orderBy('created_at', 'desc')
            ->select(['id', 'name', 'created_at'])
            ->take(5)
            ->get();
        foreach ($recentUsers as $user) {
            $activities[] = [
                'id' => 'user_' . $user->id,
                'type' => 'user_registration',
                'message' => "New user registered: " . ($user->name ?? 'User #' . $user->id),
                'timestamp' => $user->created_at->diffForHumans(),
                'created_at' => $user->created_at,
                'icon' => 'user',
            ];
        }
        
        // Get recent subscription changes (real data from users table) - optimized
        $subscribedUsers = \App\Models\User::where('subscription_status', 'active')
            ->whereNotNull('subscription_start_date')
            ->orderBy('subscription_start_date', 'desc')
            ->select(['id', 'name', 'subscription_start_date'])
            ->take(5)
            ->get();
        foreach ($subscribedUsers as $user) {
            $activities[] = [
                'id' => 'sub_' . $user->id,
                'type' => 'subscription',
                'message' => "New subscription: " . ($user->name ?? 'User #' . $user->id),
                'timestamp' => $user->subscription_start_date->diffForHumans(),
                'created_at' => $user->subscription_start_date,
                'icon' => 'credit-card',
            ];
        }
        
        // Get recent comments (real data) - optimized with select
        $recentComments = \App\Models\Comment::orderBy('created_at', 'desc')
            ->select(['id', 'movie_id', 'created_at'])
            ->take(5)
            ->get();
        foreach ($recentComments as $comment) {
            $activities[] = [
                'id' => 'comment_' . $comment->id,
                'type' => 'comment',
                'message' => "New comment on movie",
                'timestamp' => $comment->created_at->diffForHumans(),
                'created_at' => $comment->created_at,
                'icon' => 'message',
            ];
        }
        
        // Get recent izisobanuye movie uploads - optimized with select
        $recentIzisobanuyeMovies = \App\Models\IzisobanuyeMovie::orderBy('created_at', 'desc')
            ->select(['id', 'title', 'created_at'])
            ->take(5)
            ->get();
        foreach ($recentIzisobanuyeMovies as $movie) {
            $activities[] = [
                'id' => 'izisobanuye_' . $movie->id,
                'type' => 'izisobanuye_upload',
                'message' => "New izisobanuye movie uploaded: {$movie->title}",
                'timestamp' => $movie->created_at->diffForHumans(),
                'created_at' => $movie->created_at,
                'icon' => 'upload',
            ];
        }
        
        // Sort all activities by created_at (most recent first) and take top 10
        $allActivities = collect($activities)->sortByDesc('created_at')->take(10)->values();

        return response()->json($allActivities);
    }

    public function getTopPerformingMovies()
    {
        $topMovies = Movie::where('is_deleted_for_users', false)
            ->orderBy('view_count', 'desc')
            ->select(['id', 'tmdb_id', 'title', 'poster_path', 'rating', 'view_count'])
            ->take(5)
            ->get()
            ->map(function ($movie) {
                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'poster' => $movie->poster_path ? 'https://image.tmdb.org/t/p/w500' . $movie->poster_path : null,
                    'rating' => $movie->rating,
                    'view_count' => $movie->view_count,
                ];
            });

        return response()->json($topMovies);
    }

    public function getRecentIzisobanuyeMovies()
    {
        $recentMovies = IzisobanuyeMovie::where('is_deleted_for_users', false)
            ->orderBy('created_at', 'desc')
            ->select(['id', 'title', 'poster_file_path', 'poster_path', 'rating', 'created_at'])
            ->take(5)
            ->get()
            ->map(function ($movie) {
                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'poster' => $movie->poster_file_path ?: ($movie->poster_path ? 'https://image.tmdb.org/t/p/w500' . $movie->poster_path : '/Images/default-movie.jpg'),
                    'rating' => $movie->rating,
                    'created_at' => $movie->created_at,
                ];
            });

        return response()->json($recentMovies);
    }

    public function getRecentUntranslatedMovies()
    {
        // Get untranslated movies from TMDB API (izidasobanuye)
        $apiKey = config('services.tmdb.key');
        
        // Fetch popular movies from TMDB
        $response = Http::get("https://api.themoviedb.org/3/movie/popular", [
            'api_key' => $apiKey,
            'page' => 1,
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            $movies = $data['results'] ?? [];
            
            $recentMovies = collect($movies)->take(10)->map(function ($movie) {
                return [
                    'id' => $movie['id'],
                    'tmdb_id' => $movie['id'],
                    'title' => $movie['title'],
                    'poster' => $movie['poster_path'] 
                        ? 'https://image.tmdb.org/t/p/w500' . $movie['poster_path'] 
                        : '/Images/default-movie.jpg',
                    'rating' => $movie['vote_average'] ?? 0,
                    'view_count' => 0,
                    'release_year' => $movie['release_date'] 
                        ? substr($movie['release_date'], 0, 4) 
                        : null,
                    'interpreter' => null, // TMDB movies don't have interpreter (untranslated)
                    'created_at' => now(),
                ];
            });
            
            return response()->json($recentMovies);
        }
        
        return response()->json([]);
    }

    // New paginated endpoint for admin movie management - fetches from TMDB API with view counts from local DB
    public function getPaginatedUntranslatedMovies(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 20);
        $search = $request->get('search', '');
        
        $apiKey = config('services.tmdb.key');
        
        // Determine which endpoint to use: search or popular
        $endpoint = $search
            ? "https://api.themoviedb.org/3/search/movie"
            : "https://api.themoviedb.org/3/movie/popular";
        
        // Build query parameters
        $params = [
            'api_key' => $apiKey,
            'page' => $page,
        ];
        
        if ($search) {
            $params['query'] = $search;
        }
        
        $response = Http::get($endpoint, $params);
        
        if ($response->successful()) {
            $data = $response->json();
            $movies = $data['results'] ?? [];
            
            // Get all TMDB IDs to fetch view counts from local database in one query
            $tmdbIds = collect($movies)->pluck('id')->toArray();
            $localMovies = Movie::whereIn('tmdb_id', $tmdbIds)->get()->keyBy('tmdb_id');
            
            $formattedMovies = collect($movies)->map(function ($movie) use ($localMovies) {
                // Get view count from local database if available
                $localMovie = $localMovies->get($movie['id']);
                $viewCount = $localMovie ? $localMovie->view_count : 0;
                
                return [
                    'id' => $movie['id'],
                    'tmdb_id' => $movie['id'],
                    'title' => $movie['title'],
                    'description' => $movie['overview'] ?? '',
                    'poster_path' => $movie['poster_path'] ?? null,
                    'rating' => round($movie['vote_average'] ?? 0, 1),
                    'genres' => [], // TMDB doesn't include genre names in basic response
                    'release_year' => $movie['release_date'] 
                        ? (int)substr($movie['release_date'], 0, 4) 
                        : null,
                    'duration' => $movie['runtime'] ?? null,
                    'interpreter' => $localMovie ? $localMovie->interpreter : null,
                    'trailer_url' => $localMovie ? $localMovie->trailer_url : null,
                    'view_count' => $viewCount,
                    'is_deleted_for_users' => $localMovie ? $localMovie->is_deleted_for_users : false,
                    'created_at' => $localMovie ? $localMovie->created_at->toISOString() : now()->toISOString(),
                    'updated_at' => $localMovie ? $localMovie->updated_at->toISOString() : now()->toISOString(),
                ];
            });
            
            // Build Laravel-style pagination response
            return response()->json([
                'current_page' => $page,
                'data' => $formattedMovies,
                'first_page_url' => url("/admin/api/untranslated-movies?page=1&per_page={$perPage}"),
                'from' => ($page - 1) * $perPage + 1,
                'last_page' => $data['total_pages'] ?? 1,
                'last_page_url' => url("/admin/api/untranslated-movies?page=" . ($data['total_pages'] ?? 1) . "&per_page={$perPage}"),
                'links' => [
                    ['url' => $page > 1 ? url("/admin/api/untranslated-movies?page=" . ($page - 1) . "&per_page={$perPage}") : null, 'label' => '&laquo; Previous', 'active' => false],
                    ['url' => url("/admin/api/untranslated-movies?page=1&per_page={$perPage}"), 'label' => '1', 'active' => $page === 1],
                    ['url' => null, 'label' => '...', 'active' => false],
                    ['url' => $page < ($data['total_pages'] ?? 1) ? url("/admin/api/untranslated-movies?page=" . ($page + 1) . "&per_page={$perPage}") : null, 'label' => 'Next &raquo;', 'active' => false],
                ],
                'next_page_url' => $page < ($data['total_pages'] ?? 1) 
                    ? url("/admin/api/untranslated-movies?page=" . ($page + 1) . "&per_page={$perPage}") 
                    : null,
                'path' => url('/admin/api/untranslated-movies'),
                'per_page' => $perPage,
                'prev_page_url' => $page > 1 
                    ? url("/admin/api/untranslated-movies?page=" . ($page - 1) . "&per_page={$perPage}") 
                    : null,
                'to' => min($page * $perPage, $data['total_results'] ?? $perPage),
                'total' => $data['total_results'] ?? 0,
            ]);
        }
        
        return response()->json([
            'current_page' => 1,
            'data' => [],
            'last_page' => 1,
            'total' => 0,
        ]);
    }

    public function getMovieCounts()
    {
        $translatedCount = Movie::where('is_deleted_for_users', false)->count();
        $untranslatedCount = Movie::where('is_deleted_for_users', true)->count();

        return response()->json([
            'translated' => $translatedCount,
            'untranslated' => $untranslatedCount,
        ]);
    }

    public function getNotificationCounts()
    {
        $translatedNotifications = MovieViewNotification::whereHas('movie', function ($query) {
            $query->where('is_deleted_for_users', false);
        })->unread()->count();

        $untranslatedNotifications = MovieViewNotification::whereHas('movie', function ($query) {
            $query->where('is_deleted_for_users', true);
        })->unread()->count();

        return response()->json([
            'translated' => $translatedNotifications,
            'untranslated' => $untranslatedNotifications,
        ]);
    }

    public function homepageMovies()
    {
        $movies = Movie::where('is_deleted_for_users', false)
            ->whereNotNull('interpreter')
            ->orderBy('created_at', 'desc')
            ->select(['id', 'tmdb_id', 'title', 'poster_file_path', 'poster_path', 'rating', 'genres', 'description', 'release_year', 'duration', 'interpreter', 'trailer_url', 'movie_file_path'])
            ->get()
            ->map(function ($movie) {
                return [
                    'id' => $movie->tmdb_id,
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
                    'category' => 'recent', // Default category for now
                ];
            });

        return response()->json($movies);
    }

    public function originalMovies()
    {
        $movies = Movie::where('is_deleted_for_users', false)
            ->whereNull('interpreter')
            ->orderBy('created_at', 'desc')
            ->select(['id', 'tmdb_id', 'title', 'poster_file_path', 'poster_path', 'rating', 'genres', 'description', 'release_year', 'duration', 'interpreter', 'trailer_url', 'movie_file_path'])
            ->get()
            ->map(function ($movie) {
                return [
                    'id' => $movie->tmdb_id,
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
                    'category' => 'recent', // Default category for now
                ];
            });

        return response()->json($movies);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tmdb_id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'poster_path' => 'nullable|string',
            'rating' => 'required|numeric|min:0|max:10',
            'genres' => 'nullable|array',
            'release_year' => 'nullable|integer',
            'duration' => 'nullable|integer',
            'interpreter' => 'nullable|string',
            'trailer_url' => 'nullable|string',
            'movie_file' => 'nullable|file|mimes:mp4,avi,mkv,mov,wmv,flv,webm|max:1048576', // 1GB max
            'poster_file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB max
        ]);

        $data = $validated;

        // Handle movie file upload
        if ($request->hasFile('movie_file')) {
            $movieFile = $request->file('movie_file');
            $movieFileName = time() . '_' . $movieFile->getClientOriginalName();
            $movieFile->storeAs('movies', $movieFileName, 'public');
            $data['movie_file_path'] = 'storage/movies/' . $movieFileName;
        }

        // Handle poster file upload
        if ($request->hasFile('poster_file')) {
            $posterFile = $request->file('poster_file');
            $posterFileName = time() . '_' . $posterFile->getClientOriginalName();
            $posterFile->storeAs('posters', $posterFileName, 'public');
            $data['poster_file_path'] = 'storage/posters/' . $posterFileName;
        }

        // If no tmdb_id provided, generate one
        if (!isset($data['tmdb_id'])) {
            $data['tmdb_id'] = time() + rand(1000, 9999);
        }

        $movie = Movie::create($data);

        return response()->json($movie, 201);
    }

    // Izisobanuye Movie Management Methods
    public function storeIzisobanuyeMovie(Request $request)
    {
        \Log::info('Starting Izisobanuye movie upload', [
            'request_data' => $request->all(),
            'files' => $request->allFiles(),
            'csrf_token' => $request->header('X-CSRF-TOKEN')
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'poster_path' => 'nullable|string',
            'rating' => 'required|numeric|min:0|max:10',
            'genres' => 'nullable|array',
            'release_year' => 'nullable|integer',
            'duration' => 'nullable|integer',
            'interpreter' => 'required|string',
            'trailer_url' => 'nullable|string',
            'movie_file' => 'nullable|file|mimes:mp4,avi,mkv,mov,wmv,flv,webm|max:512000', // 500MB max
            'poster_file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB max
        ]);

        \Log::info('Validation passed', ['validated_data' => $validated]);

        $data = $validated;

        // Handle movie file upload
        if ($request->hasFile('movie_file')) {
            $movieFile = $request->file('movie_file');
            $movieFileName = time() . '_' . $movieFile->getClientOriginalName();
            \Log::info('Uploading movie file', ['filename' => $movieFileName, 'size' => $movieFile->getSize()]);
            $movieFile->storeAs('izisobanuye/movies', $movieFileName, 'public');
            $data['movie_file_path'] = 'storage/izisobanuye/movies/' . $movieFileName;
            \Log::info('Movie file uploaded successfully', ['path' => $data['movie_file_path']]);
        }

        // Handle poster file upload
        if ($request->hasFile('poster_file')) {
            $posterFile = $request->file('poster_file');
            $posterFileName = time() . '_' . $posterFile->getClientOriginalName();
            \Log::info('Uploading poster file', ['filename' => $posterFileName, 'size' => $posterFile->getSize()]);
            $posterFile->storeAs('izisobanuye/posters', $posterFileName, 'public');
            $data['poster_file_path'] = 'storage/izisobanuye/posters/' . $posterFileName;
            \Log::info('Poster file uploaded successfully', ['path' => $data['poster_file_path']]);
        }

        \Log::info('Creating IzisobanuyeMovie record', ['data' => $data]);
        $movie = IzisobanuyeMovie::create($data);
        \Log::info('IzisobanuyeMovie created successfully', ['movie_id' => $movie->id]);

        return response()->json($movie, 201);
    }

    public function getIzisobanuyeMovies(Request $request)
    {
        $query = IzisobanuyeMovie::query();

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
        $perPage = $request->get('per_page', 100);
        return $query->paginate($perPage);
    }

    public function toggleIzisobanuyeMovieStatus($id)
    {
        $movie = IzisobanuyeMovie::findOrFail($id);
        $movie->update(['is_deleted_for_users' => !$movie->is_deleted_for_users]);

        return response()->json(['success' => true]);
    }

    public function getIzisobanuyeMoviesForUsers()
    {
        $movies = IzisobanuyeMovie::where('is_deleted_for_users', false)
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

        return response()->json($movies);
    }

    public function getReportsData(Request $request)
    {
        $timeRange = $request->get('time_range', '30d');

        // Calculate date range based on time_range
        $startDate = match($timeRange) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '1y' => now()->subYear(),
            default => now()->subDays(30),
        };

        $data = [];

        // Movies Reports
        $totalMovies = Movie::where('is_deleted_for_users', false)->count() + IzisobanuyeMovie::where('is_deleted_for_users', false)->count();
        $newMoviesThisMonth = Movie::where('created_at', '>=', now()->startOfMonth())->count() + IzisobanuyeMovie::where('created_at', '>=', now()->startOfMonth())->count();

        // Most viewed movie
        $mostViewedMovie = Movie::where('is_deleted_for_users', false)->orderBy('view_count', 'desc')->first();
        $mostViewedIzisobanuye = IzisobanuyeMovie::where('is_deleted_for_users', false)->orderBy('view_count', 'desc')->first();

        $mostViewed = null;
        if ($mostViewedMovie && $mostViewedIzisobanuye) {
            $mostViewed = $mostViewedMovie->view_count > $mostViewedIzisobanuye->view_count ? $mostViewedMovie->title : $mostViewedIzisobanuye->title;
        } elseif ($mostViewedMovie) {
            $mostViewed = $mostViewedMovie->title;
        } elseif ($mostViewedIzisobanuye) {
            $mostViewed = $mostViewedIzisobanuye->title;
        }

        // Average rating
        $avgRating = round(Movie::where('is_deleted_for_users', false)->avg('rating') ?? 0, 1);

        // Movies by category/genre
        $genreCounts = [];
        $movies = Movie::where('is_deleted_for_users', false)->get();
        foreach ($movies as $movie) {
            if ($movie->genres) {
                foreach ($movie->genres as $genre) {
                    $genreCounts[$genre] = ($genreCounts[$genre] ?? 0) + 1;
                }
            }
        }
        $izisobanuyeMovies = IzisobanuyeMovie::where('is_deleted_for_users', false)->get();
        foreach ($izisobanuyeMovies as $movie) {
            if ($movie->genres) {
                foreach ($movie->genres as $genre) {
                    $genreCounts[$genre] = ($genreCounts[$genre] ?? 0) + 1;
                }
            }
        }

        $totalGenreMovies = array_sum($genreCounts);
        $moviesByGenre = [];
        foreach ($genreCounts as $genre => $count) {
            $moviesByGenre[] = [
                'genre' => $genre,
                'count' => $count,
                'percentage' => $totalGenreMovies > 0 ? round(($count / $totalGenreMovies) * 100, 1) : 0,
            ];
        }
        usort($moviesByGenre, fn($a, $b) => $b['count'] <=> $a['count']);

        // Most viewed movies
        $mostViewedMovies = Movie::where('is_deleted_for_users', false)
            ->orderBy('view_count', 'desc')
            ->take(5)
            ->get(['title', 'view_count', 'rating']);

        $mostViewedIzisobanuyeMovies = IzisobanuyeMovie::where('is_deleted_for_users', false)
            ->orderBy('view_count', 'desc')
            ->take(5)
            ->get(['title', 'view_count', 'rating']);

        $allMostViewed = collect([...$mostViewedMovies, ...$mostViewedIzisobanuyeMovies])
            ->sortByDesc('view_count')
            ->take(5)
            ->map(fn($movie) => [
                'title' => $movie->title,
                'views' => number_format($movie->view_count),
                'rating' => $movie->rating,
            ]);

        // Highest rated movies
        $highestRatedMovies = Movie::where('is_deleted_for_users', false)
            ->whereNotNull('rating')
            ->orderBy('rating', 'desc')
            ->take(5)
            ->get(['title', 'rating']);

        $highestRatedIzisobanuye = IzisobanuyeMovie::where('is_deleted_for_users', false)
            ->whereNotNull('rating')
            ->orderBy('rating', 'desc')
            ->take(5)
            ->get(['title', 'rating']);

        $allHighestRated = collect([...$highestRatedMovies, ...$highestRatedIzisobanuye])
            ->sortByDesc('rating')
            ->take(5)
            ->map(fn($movie) => [
                'title' => $movie->title,
                'rating' => $movie->rating,
                'votes' => 'N/A', // We don't have vote counts
            ]);

        $data['movies'] = [
            'total_movies' => $totalMovies,
            'new_this_month' => $newMoviesThisMonth,
            'most_viewed' => $mostViewed,
            'avg_rating' => $avgRating,
            'movies_by_genre' => $moviesByGenre,
            'most_viewed_movies' => $allMostViewed,
            'highest_rated_movies' => $allHighestRated,
        ];

        // Users Reports
        $totalUsers = \App\Models\User::count();
        $activeUsers = \App\Models\User::where('created_at', '>=', $startDate)->count();
        $newUsersThisMonth = \App\Models\User::where('created_at', '>=', now()->startOfMonth())->count();
        $avgWatchTime = MovieViewNotification::whereNotNull('watch_duration')->avg('watch_duration') ?? 0;
        $avgWatchTimeFormatted = $avgWatchTime > 0 ? sprintf('%dh %dm', floor($avgWatchTime / 3600), floor(($avgWatchTime % 3600) / 60)) : '0h 0m';

        // User activity status (mock data for now, as we don't have last activity tracking)
        $userActivity = [
            'active' => ['count' => round($totalUsers * 0.7), 'percentage' => 70.5],
            'inactive' => ['count' => round($totalUsers * 0.2), 'percentage' => 20.3],
            'dormant' => ['count' => round($totalUsers * 0.1), 'percentage' => 9.2],
        ];

        // Subscription overview
        $activeSubscriptions = \App\Models\User::where('subscription_status', 'active')->count();
        $expiredSubscriptions = \App\Models\User::where('subscription_status', 'expired')->count();
        $canceledSubscriptions = \App\Models\User::where('subscription_status', 'canceled')->count();
        $freeTrials = \App\Models\User::where('subscription_status', 'trial')->count();

        // Top users by watch time
        $topUsers = MovieViewNotification::selectRaw('ip_address as user_name, SUM(watch_duration) as total_watch_time, COUNT(*) as movies_watched')
            ->whereNotNull('watch_duration')
            ->groupBy('ip_address')
            ->orderBy('total_watch_time', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                $hours = floor($user->total_watch_time / 3600);
                $minutes = floor(($user->total_watch_time % 3600) / 60);
                return [
                    'name' => $user->user_name,
                    'watchTime' => "{$hours}h {$minutes}m",
                    'movies' => $user->movies_watched,
                ];
            });

        $data['users'] = [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
            'new_this_month' => $newUsersThisMonth,
            'avg_watch_time' => $avgWatchTimeFormatted,
            'user_activity' => $userActivity,
            'subscription_overview' => [
                'active' => $activeSubscriptions,
                'expired' => $expiredSubscriptions,
                'canceled' => $canceledSubscriptions,
                'free_trial' => $freeTrials,
            ],
            'top_users' => $topUsers,
        ];

        // Subscription & Payment Reports
        $monthlyRevenue = 0; // TODO: Implement when payment system is added
        $newSubscriptions = \App\Models\User::where('subscription_start_date', '>=', $startDate)->count();
        $renewals = \App\Models\User::where('subscription_start_date', '>=', $startDate)->where('subscription_status', 'active')->count();
        $cancellations = \App\Models\User::where('subscription_expiry_date', '>=', $startDate)->where('subscription_status', 'canceled')->count();

        $data['subscription'] = [
            'monthly_revenue' => $monthlyRevenue,
            'new_subscriptions' => $newSubscriptions,
            'renewals' => $renewals,
            'cancellations' => $cancellations,
            'revenue_breakdown' => [
                'monthly_plans' => ['amount' => 0, 'percentage' => 0],
                'yearly_plans' => ['amount' => 0, 'percentage' => 0],
                'weekly_plans' => ['amount' => 0, 'percentage' => 0],
            ],
            'subscription_trends' => [
                'new_subscriptions' => ['count' => $newSubscriptions, 'change' => 0],
                'renewals' => ['count' => $renewals, 'change' => 0],
                'cancellations' => ['count' => $cancellations, 'change' => 0],
            ],
        ];

        // Comments & Engagement Reports
        $totalComments = \App\Models\Comment::count();
        $commentsThisMonth = \App\Models\Comment::where('created_at', '>=', now()->startOfMonth())->count();

        // Most commented movie (simplified - we don't have movie-comment relationship yet)
        $mostCommentedMovie = 'Inception'; // Placeholder

        $flaggedComments = \App\Models\Comment::where('status', 'flagged')->count();

        // Most commented movies (placeholder data)
        $mostCommentedMovies = [
            ['title' => 'Inception', 'comments' => 234, 'engagement' => 'High'],
            ['title' => 'The Dark Knight', 'comments' => 198, 'engagement' => 'High'],
            ['title' => 'Interstellar', 'comments' => 187, 'engagement' => 'High'],
            ['title' => 'Pulp Fiction', 'comments' => 156, 'engagement' => 'Medium'],
            ['title' => 'The Matrix', 'comments' => 143, 'engagement' => 'Medium'],
        ];

        // Comment status breakdown
        $approvedComments = \App\Models\Comment::where('status', 'approved')->count();
        $pendingComments = \App\Models\Comment::where('status', 'pending')->count();
        $flaggedCommentsCount = $flaggedComments;
        $adminReplies = \App\Models\Comment::whereNotNull('admin_reply')->count();

        $data['engagement'] = [
            'total_comments' => $totalComments,
            'comments_this_month' => $commentsThisMonth,
            'most_commented_movie' => $mostCommentedMovie,
            'flagged_comments' => $flaggedComments,
            'most_commented_movies' => $mostCommentedMovies,
            'comment_status' => [
                'approved' => $approvedComments,
                'pending' => $pendingComments,
                'flagged' => $flaggedCommentsCount,
                'admin_replies' => $adminReplies,
            ],
        ];

        // System Reports
        $systemUptime = 99.8; // Mock data
        $storageUsed = '2.4TB'; // Mock data
        $errorRate = 0.02; // Mock data
        $avgResponseTime = 245; // Mock data

        // Recent system errors (mock data)
        $recentErrors = [
            ['time' => '2 hours ago', 'error' => 'Video streaming buffer timeout', 'severity' => 'Medium'],
            ['time' => '5 hours ago', 'error' => 'Database connection timeout', 'severity' => 'High'],
            ['time' => '1 day ago', 'error' => 'Payment gateway timeout', 'severity' => 'Medium'],
            ['time' => '2 days ago', 'error' => 'CDN cache miss rate high', 'severity' => 'Low'],
            ['time' => '3 days ago', 'error' => 'User authentication failure', 'severity' => 'Medium'],
        ];

        // Storage usage breakdown (mock data)
        $storageBreakdown = [
            ['category' => 'Video Content', 'used' => '1.8TB', 'percentage' => 75],
            ['category' => 'User Data', 'used' => '360GB', 'percentage' => 15],
            ['category' => 'System Logs', 'used' => '120GB', 'percentage' => 5],
            ['category' => 'Available', 'used' => '120GB', 'percentage' => 5],
        ];

        $data['system'] = [
            'system_uptime' => $systemUptime,
            'storage_used' => $storageUsed,
            'error_rate' => $errorRate,
            'avg_response_time' => $avgResponseTime,
            'recent_errors' => $recentErrors,
            'storage_breakdown' => $storageBreakdown,
        ];

        return response()->json($data);
    }

    public function getHero()
    {
        $hero = \App\Models\Hero::first();
        return response()->json($hero);
    }

    public function storeHero(Request $request)
    {
        \Log::info('StoreHero called', ['request_data' => $request->all()]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'overview' => 'nullable|string',
                'genre' => 'nullable|string',
                'release_year' => 'nullable|integer',
                'watch_now_url' => 'nullable|string',
                'watch_trailer_url' => 'nullable|string',
            ]);

            // Validate poster file separately
            if ($request->hasFile('poster_file')) {
                $request->validate([
                    'poster_file' => 'file|mimes:jpg,jpeg,png,gif,webp|max:5120', // 5MB max
                ]);
            }

            \Log::info('Validation passed', ['validated' => $validated]);

            $data = $validated;

            // Handle poster file upload
            if ($request->hasFile('poster_file')) {
                $posterFile = $request->file('poster_file');
                $posterFileName = time() . '_' . $posterFile->getClientOriginalName();
                $posterFile->storeAs('heroes', $posterFileName, 'public');
                $data['poster_path'] = 'heroes/' . $posterFileName;
                \Log::info('Poster file uploaded', ['path' => $data['poster_path']]);
            }

            $hero = \App\Models\Hero::updateOrCreate([], $data);
            \Log::info('Hero saved', ['hero' => $hero]);

            return response()->json($hero, 200);
        } catch (\Exception $e) {
            \Log::error('Error saving hero', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
