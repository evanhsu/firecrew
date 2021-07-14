<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResourceStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resource_statuses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('statusable_resource_id');   // NOT NULL
            $table->string('statusable_resource_type')->nullable();
            $table->string('statusable_resource_name')->nullable();

            $table->string('crew_name',100)->nullable();

            $table->double('latitude',11,8);
            $table->double('longitude',11,8);

            $table->integer('distance')->nullable();    // The radius of the 'buffer' to draw around this map icon
            $table->string('label_text',100)->nullable();

            $table->text('popup_content')->nullable();

            $table->string('staffing_category1',100)->nullable();
            $table->string('staffing_value1',100)->nullable();
            $table->string('staffing_category2',100)->nullable();
            $table->string('staffing_value2',100)->nullable();
            $table->string('staffing_category3',100)->nullable();
            $table->string('staffing_value3',100)->nullable();

            $table->string('manager_name',100)->nullable();
            $table->string('manager_phone',100)->nullable();

            $table->string('location_name')->nullable();

            $table->text('comments1')->nullable();
            $table->text('comments2')->nullable();

            $table->string('assigned_fire_name',50)->nullable();
            $table->string('assigned_fire_number',50)->nullable();
            $table->string('assigned_supervisor',100)->nullable();
            $table->string('assigned_supervisor_phone',100)->nullable();

            $table->string('created_by_name');
            $table->integer("created_by_id");

            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('resource_statuses');
    }
}
