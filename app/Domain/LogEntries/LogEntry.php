<?php

namespace App\Domain\LogEntries;

use Illuminate\Database\Eloquent\Model;

class LogEntry extends Model
{
    public function loggable()
    {
    	return $this->morphTo();
    }
}
