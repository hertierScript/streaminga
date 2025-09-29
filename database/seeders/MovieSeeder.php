<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $movies = [
            [
                'tmdb_id' => 27205,
                'title' => 'Inception',
                'description' => 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                'poster_path' => '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
                'rating' => 8.8,
                'genres' => ['Action', 'Science Fiction', 'Thriller'],
                'release_year' => 2010,
                'duration' => 148,
                'interpreter' => 'Christopher Nolan',
                'trailer_url' => 'https://www.youtube.com/watch?v=YoHD9XEInc0',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
            [
                'tmdb_id' => 155,
                'title' => 'The Dark Knight',
                'description' => 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
                'poster_path' => '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                'rating' => 9.0,
                'genres' => ['Drama', 'Action', 'Crime', 'Thriller'],
                'release_year' => 2008,
                'duration' => 152,
                'interpreter' => 'Christopher Nolan',
                'trailer_url' => 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
            [
                'tmdb_id' => 680,
                'title' => 'Pulp Fiction',
                'description' => 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper.',
                'poster_path' => '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
                'rating' => 8.9,
                'genres' => ['Thriller', 'Crime'],
                'release_year' => 1994,
                'duration' => 154,
                'interpreter' => 'Quentin Tarantino',
                'trailer_url' => 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
            [
                'tmdb_id' => 278,
                'title' => 'The Shawshank Redemption',
                'description' => 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
                'poster_path' => '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
                'rating' => 9.3,
                'genres' => ['Drama', 'Crime'],
                'release_year' => 1994,
                'duration' => 142,
                'interpreter' => 'Frank Darabont',
                'trailer_url' => 'https://www.youtube.com/watch?v=6hB3S9bIaco',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
            [
                'tmdb_id' => 13,
                'title' => 'Forrest Gump',
                'description' => 'A man with a low IQ has accomplished great things in his life and been present during significant historic events.',
                'poster_path' => '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
                'rating' => 8.8,
                'genres' => ['Comedy', 'Drama', 'Romance'],
                'release_year' => 1994,
                'duration' => 142,
                'interpreter' => 'Robert Zemeckis',
                'trailer_url' => 'https://www.youtube.com/watch?v=bLvqoHBptjg',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
        ];

        foreach ($movies as $movieData) {
            Movie::create($movieData);
        }
    }
}
