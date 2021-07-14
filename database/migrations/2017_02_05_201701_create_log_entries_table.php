<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('log_entries', function (Blueprint $table) {
            $table->increments('id');
            $table->string('person_name')->nullable();
            $table->integer('person_id')->unsigned()->nullable();
            $table->integer('loggable_id')->nullable();
            $table->string('loggable_type')->nullable();
            $table->string('action')->nullable();
            $table->string('attribute')->nullable();
            $table->string('old_value')->nullable();
            $table->string('new_value')->nullable();
            $table->string('comments')->nullable();
            $table->timestamps();

            $table->foreign('person_id')->references('id')->on('people')->onDelete('set null');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('log_entries');
        Schema::enableForeignKeyConstraints();
    }
}
