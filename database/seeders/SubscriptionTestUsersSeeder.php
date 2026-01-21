<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SubscriptionTestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users with different subscription statuses
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'subscription_status' => 'active',
                'subscription_start_date' => now()->subDays(30),
                'subscription_expiry_date' => now()->addDays(30),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'subscription_status' => 'expired',
                'subscription_start_date' => now()->subDays(60),
                'subscription_expiry_date' => now()->subDays(5),
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'subscription_status' => 'none',
                'subscription_start_date' => null,
                'subscription_expiry_date' => null,
            ],
            [
                'name' => 'Alice Brown',
                'email' => 'alice@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'subscription_status' => 'active',
                'subscription_start_date' => now()->subDays(15),
                'subscription_expiry_date' => now()->addDays(45),
            ],
            [
                'name' => 'Charlie Wilson',
                'email' => 'charlie@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => null, // Not verified
                'subscription_status' => 'expired',
                'subscription_start_date' => now()->subDays(90),
                'subscription_expiry_date' => now()->subDays(30),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
