<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $fillable = [
        'title',
        'overview',
        'poster_path',
        'genre',
        'release_year',
        'watch_now_url',
        'watch_trailer_url',
    ];

    protected $casts = [
        'release_year' => 'integer',
    ];
}
