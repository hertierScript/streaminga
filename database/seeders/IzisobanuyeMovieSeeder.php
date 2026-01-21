<?php

namespace Database\Seeders;

use App\Models\IzisobanuyeMovie;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IzisobanuyeMovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $movies = [
            [
                'title' => 'Umugabo w\'umukobwa',
                'description' => 'A story about a man who falls in love with a beautiful woman and faces many challenges to win her heart.',
                'poster_path' => '/sample/poster1.jpg',
                'poster_file_path' => '/storage/posters/sample1.jpg',
                'rating' => 8.5,
                'genres' => ['Romance', 'Drama'],
                'release_year' => 2023,
                'duration' => 120,
                'interpreter' => 'Local Director',
                'trailer_url' => 'https://www.youtube.com/watch?v=sample1',
                'movie_file_path' => '/storage/movies/sample1.mp4',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
            [
                'title' => 'Intambara y\'amahoro',
                'description' => 'A war story that teaches about peace and reconciliation in a community torn by conflict.',
                'poster_path' => '/sample/poster2.jpg',
                'poster_file_path' => '/storage/posters/sample2.jpg',
                'rating' => 9.0,
                'genres' => ['Drama', 'War'],
                'release_year' => 2022,
                'duration' => 135,
                'interpreter' => 'Community Theater',
                'trailer_url' => 'https://www.youtube.com/watch?v=sample2',
                'movie_file_path' => '/storage/movies/sample2.mp4',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
            [
                'title' => 'Ubumwe bw\'Abanyarwanda',
                'description' => 'A documentary celebrating the unity and culture of Rwandans through traditional stories and music.',
                'poster_path' => '/sample/poster3.jpg',
                'poster_file_path' => '/storage/posters/sample3.jpg',
                'rating' => 8.8,
                'genres' => ['Documentary', 'Cultural'],
                'release_year' => 2024,
                'duration' => 90,
                'interpreter' => 'Cultural Group',
                'trailer_url' => 'https://www.youtube.com/watch?v=sample3',
                'movie_file_path' => '/storage/movies/sample3.mp4',
                'view_count' => 0,
                'is_deleted_for_users' => false,
            ],
        ];

        foreach ($movies as $movieData) {
            IzisobanuyeMovie::create($movieData);
        }
    }
}