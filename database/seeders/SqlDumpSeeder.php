<?php
namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class SqlDumpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Generate a mysqldump with this command:
     *
     *  mysqldump -u firecrew --skip-add-drop-table --single-transaction firecrew | sed -r 's/CREATE TABLE (`[^`]+`)/TRUNCATE TABLE \1; CREATE TABLE IF NOT EXISTS \1/g' > db.sql
     *
     * @return void
     */
    public function run()
    {
        DB::unprepared( file_get_contents( "database/seeders/firecrew.sql" ) );
    }
}
