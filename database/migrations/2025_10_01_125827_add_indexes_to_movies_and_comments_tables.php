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
        // Add indexes to movies table
        Schema::table('movies', function (Blueprint $table) {
            $table->index('title');
            $table->index('view_count');
            $table->index('is_deleted_for_users');
            $table->index('release_year');
            $table->index(['is_deleted_for_users', 'view_count']);
        });

        // Add indexes to comments table
        Schema::table('comments', function (Blueprint $table) {
            $table->index('movie_id');
            $table->index('status');
            $table->index('parent_id');
            $table->index('created_at');
            $table->index(['movie_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes from movies table
        Schema::table('movies', function (Blueprint $table) {
            $table->dropIndex(['title']);
            $table->dropIndex(['view_count']);
            $table->dropIndex(['is_deleted_for_users']);
            $table->dropIndex(['release_year']);
            $table->dropIndex(['is_deleted_for_users', 'view_count']);
        });

        // Drop indexes from comments table
        Schema::table('comments', function (Blueprint $table) {
            $table->dropIndex(['movie_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['movie_id', 'status']);
        });
    }
};
