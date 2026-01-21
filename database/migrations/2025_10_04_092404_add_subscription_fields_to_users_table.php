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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('subscription_status', ['none', 'active', 'expired'])->default('none')->after('email_verified_at');
            $table->timestamp('subscription_start_date')->nullable()->after('subscription_status');
            $table->timestamp('subscription_expiry_date')->nullable()->after('subscription_start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['subscription_status', 'subscription_start_date', 'subscription_expiry_date']);
        });
    }
};
