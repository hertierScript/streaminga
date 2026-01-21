<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'tmdb_id',
        'title',
        'description',
        'poster_path',
        'rating',
        'genres',
        'release_year',
        'duration',
        'interpreter',
        'trailer_url',
        'movie_file_path',
        'poster_file_path',
        'view_count',
        'is_deleted_for_users',
    ];

    protected $casts = [
        'genres' => 'array',
        'rating' => 'decimal:2',
        'release_year' => 'integer',
        'duration' => 'integer',
        'view_count' => 'integer',
        'is_deleted_for_users' => 'boolean',
    ];
}
