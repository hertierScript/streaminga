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
        Schema::table('movie_view_notifications', function (Blueprint $table) {
            $table->unsignedBigInteger('izisobanuye_movie_id')->nullable()->after('movie_id');
            $table->foreign('izisobanuye_movie_id')->references('id')->on('izisobanuye_movies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movie_view_notifications', function (Blueprint $table) {
            $table->dropForeign(['izisobanuye_movie_id']);
            $table->dropColumn('izisobanuye_movie_id');
        });
    }
};
