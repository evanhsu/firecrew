<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAircraftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aircrafts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tailnumber', 10)->unique();
            $table->string('model', 50)->nullable();
            $table->integer('crew_id')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('crew_id')->references('id')->on('crews')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('aircrafts');
    }
}
