<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['name' => 'Beginner',  'min_achievements' => 0],
            ['name' => 'Bronze',    'min_achievements' => 4],
            ['name' => 'Silver',    'min_achievements' => 6],
            ['name' => 'Gold',      'min_achievements' => 8],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(
                ['name' => $badge['name']],
                ['min_achievements' => $badge['min_achievements']]
            );
        }
    }
}
