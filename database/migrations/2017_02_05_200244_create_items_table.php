<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('crew_id')->unsigned();
            $table->integer('parent_id')->unsigned()->nullable();
            $table->string('serial_number')->nullable();
            $table->integer('quantity')->nullable();
            $table->string('type')->nullable();
            $table->string('category')->nullable();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->string('description')->nullable();
            $table->string('condition')->nullable();
            $table->integer('checked_out_to_id')->unsigned()->nullable(); // The ID of the 'person' this item is checked out to
            $table->string('checked_out_to_type')->nullable();            // The classname of the 'person' this item is checked out to
            $table->string('note')->nullable();
            $table->boolean('usable')->default(true)->nullable();
            $table->integer('restock_trigger')->nullable();
            $table->integer('restock_to_quantity')->nullable();
            $table->string('source')->nullable();
            $table->timestamps();

            $table->foreign('crew_id')->references('id')->on('crews')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('items')->onDelete('cascade');
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
        Schema::dropIfExists('items');
        Schema::enableForeignKeyConstraints();
    }
}
