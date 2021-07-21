<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(App\Database\Seeds\Production\CrewUserResourceTableSeeder::class);
        $this->call(App\Database\Seeds\Production\ResourceStatusesTableSeeder::class);
    }
}
