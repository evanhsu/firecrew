<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStatusableResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statusable_resources', function (Blueprint $table) {
            $table->increments('id');
            $table->string('identifier', 50);
            $table->string('resource_type', 50);
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
        Schema::drop('statusable_resources');
    }
}

