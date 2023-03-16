<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCrewTableAddWebhookUrlColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('crews', 'webhook_url')) {
            return;
        }

        Schema::table('crews', function (Blueprint $table) {
            $table->string('webhook_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('crews', 'webhook_url')) {
            Schema::table('crews', function (Blueprint $table) {
                $table->dropColumn('webhook_url');
            });    
        }
    }
}
