<?php

namespace Database\Seeders;

use App\Models\Subject;
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
                'account_id' => 'MA21011504',
                'password' => Hash::make('12345678'), // default password
            ]
        );

        User::updateOrCreate(
            ['email' => 'instructor@example.com'], // search
            [
                'name' => 'instructor',
                'account_id' => 'IN12345678',
                'password' => Hash::make('12345678'), // default password
                'role' => 'instructor'
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@example.com'], // search
            [
                'name' => 'admin',
                'account_id' => 'ADMIN123',
                'password' => Hash::make('12345678'), // default password
                'role' => 'admin'
            ]
        );

        Subject::updateOrCreate([
            'code' => 'MATH201',
            'title' => 'Advanced Mathematics',
            'description' => 'A course on advanced mathematics topics.',
            'year_level' => '1',
            'semester' => '1st',
            'isActive' => true,
        ]);

        Subject::updateOrCreate([
            'code' => 'CS101',
            'title' => 'Introduction to Computer Science',
            'description' => 'An introductory course to computer science concepts.',
            'year_level' => '1',
            'semester' => '1st',
            'isActive' => true,
        ]);
    }
}
