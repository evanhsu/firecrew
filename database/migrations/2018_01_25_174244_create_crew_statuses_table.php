<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCrewStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('crew_statuses', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('crew_id')->unsigned();

            $table->string('location_name')->nullable();
            $table->double('latitude',11,8)->nullable();
            $table->double('longitude',11,8)->nullable();

            $table->text('popup_content')->nullable();

            $table->text('intel')->nullable();
            $table->text('duty_officer_name')->nullable();
            $table->text('duty_officer_phone')->nullable();

            $table->string('personnel_1_name',50)->nullable();
            $table->string('personnel_1_role',50)->nullable();
            $table->string('personnel_1_location',50)->nullable();
            $table->text('personnel_1_note')->nullable();

            $table->string('personnel_2_name',50)->nullable();
            $table->string('personnel_2_role',50)->nullable();
            $table->string('personnel_2_location',50)->nullable();
            $table->text('personnel_2_note')->nullable();

            $table->string('personnel_3_name',50)->nullable();
            $table->string('personnel_3_role',50)->nullable();
            $table->string('personnel_3_location',50)->nullable();
            $table->text('personnel_3_note')->nullable();

            $table->string('personnel_4_name',50)->nullable();
            $table->string('personnel_4_role',50)->nullable();
            $table->string('personnel_4_location',50)->nullable();
            $table->text('personnel_4_note')->nullable();

            $table->string('personnel_5_name',50)->nullable();
            $table->string('personnel_5_role',50)->nullable();
            $table->string('personnel_5_location',50)->nullable();
            $table->text('personnel_5_note')->nullable();

            $table->string('personnel_6_name',50)->nullable();
            $table->string('personnel_6_role',50)->nullable();
            $table->string('personnel_6_location',50)->nullable();
            $table->text('personnel_6_note')->nullable();

            $table->text('training_note')->nullable();

            $table->string('created_by_name');
            $table->integer("created_by_id");

            $table->timestampsTz();


            $table->foreign('crew_id')->references('id')->on('crews')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('crew_statuses');
    }
}
