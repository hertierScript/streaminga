<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('izisobanuye_movies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('poster_path')->nullable();
            $table->string('poster_file_path')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->json('genres')->nullable();
            $table->year('release_year')->nullable();
            $table->integer('duration')->nullable();
            $table->string('interpreter');
            $table->string('trailer_url')->nullable();
            $table->string('movie_file_path')->nullable();
            $table->unsignedInteger('view_count')->default(0);
            $table->boolean('is_deleted_for_users')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('izisobanuye_movies');
    }
};
