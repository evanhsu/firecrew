<?php

namespace Tests\Feature\Api;

use Illuminate\Support\Facades\DB;
use PDOException;

class HealthzApiTest extends ApiTestCase
{
    public function test_healthz_returns_ok_when_database_is_connected(): void
    {
        $response = $this->get('/api/healthz');

        $response->assertOk();
        $response->assertSee('OK');
    }

    public function test_healthz_returns_service_unavailable_when_database_connection_fails(): void
    {
        DB::shouldReceive('connection')
            ->once()
            ->andReturnSelf();

        DB::shouldReceive('getPdo')
            ->once()
            ->andThrow(new PDOException('Connection refused'));

        $response = $this->get('/api/healthz');

        $response->assertStatus(503);
        $response->assertSee('NOPE');
    }
}
