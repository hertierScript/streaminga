<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // URL caching can be implemented differently if needed

        // Enable query optimization
        \Illuminate\Database\Eloquent\Model::preventAccessingMissingAttributes();
        \Illuminate\Database\Eloquent\Model::preventSilentlyDiscardingAttributes();

        // Add response caching for static assets
        if ($this->app->environment('production')) {
            \Illuminate\Support\Facades\Response::macro('cacheFor', function ($minutes) {
                return $this->header('Cache-Control', 'public, max-age=' . ($minutes * 60));
            });
        }
    }
}
