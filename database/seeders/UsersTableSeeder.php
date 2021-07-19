<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Domain\Users\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->delete();

        $user = User::create([
        	'name'	=> 'Evan Hsu',
        	'email' => 'evanhsu@gmail.com',
        	'password'	=> bcrypt('password'),
        	]);
    }
}
