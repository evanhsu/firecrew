<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Crews\Crew;

class CrewsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('crews')->delete();

    	Crew::create([
    		'id' => 1,
    		'name' => 'Siskiyou Rappel Crew',
    		'abbreviation' => 'src',
    		'type' => 'rappel',
    		'region' => 6,
    		'logo_filename' => 'images/crew1.png',
    		]);
    }
}
