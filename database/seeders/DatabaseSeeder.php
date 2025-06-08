<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::updateOrCreate(
            ['email' => 'student@example.com'], // search
            [
                'name' => 'student',
                'password' => Hash::make('12345678'), // default password
            ]
        );

        User::updateOrCreate(
            ['email' => 'teacher@example.com'], // search
            [
                'name' => 'teacher',
                'password' => Hash::make('12345678'), // default password
                'role' => 'teacher'
            ]
        );
    }
}
