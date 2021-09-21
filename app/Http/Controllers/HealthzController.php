<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use PDOException;

class HealthzController extends Controller
{
    public function get(): Response
    {
        try {
            DB::connection()->getPdo();
            return new Response("OK", 200);
        } catch (Exception $e) {
            return new Response("NOPE", $e instanceof PDOException ? 503 : 500);
        }
    }
}
