<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class EtlDbSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Populate the 'siskiyou_general' database with a raw database dump from the old website
        DB::connection('etl_source')->unprepared(file_get_contents('app/Console/ETL/siskiyou_general.sql'));

        // ETL the old data into the new database
        Artisan::call('etl:run');
    }
}
