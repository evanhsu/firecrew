<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('log_entries');
        Schema::dropIfExists('items');
        Schema::dropIfExists('crew_person');
        Schema::dropIfExists('people');
        Schema::dropIfExists('vips');
    }

    public function down(): void
    {
        // Inventory tables are intentionally not restored.
    }
};
