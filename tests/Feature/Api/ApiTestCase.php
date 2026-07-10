<?php

namespace Tests\Feature\Api;

use Database\Seeders\ApiRegressionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    protected ApiRegressionSeeder $fixtures;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fixtures = new ApiRegressionSeeder();
        $this->fixtures->run();
    }

    protected function apiGet(string $uri)
    {
        return $this->getJson($uri);
    }
}
