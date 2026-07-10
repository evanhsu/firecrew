<?php

namespace Tests\Feature\Api;

class SummaryApiTest extends ApiTestCase
{
    public function test_summary_returns_crews_with_status_and_resources(): void
    {
        $response = $this->apiGet('/api/summary');

        $response->assertOk();
        $response->assertJsonFragment([
            'name' => $this->fixtures->crewWithStatus->name,
        ]);

        $payload = $response->json();
        $this->assertIsArray($payload);

        $crew = collect($payload)->firstWhere('name', $this->fixtures->crewWithStatus->name);
        $this->assertNotNull($crew);
        $this->assertArrayHasKey('status', $crew);
        $this->assertArrayHasKey('statusable_resources', $crew);
        $this->assertNotEmpty($crew['statusable_resources']);

        $resource = collect($crew['statusable_resources'])->firstWhere('identifier', 'NREG01');
        $this->assertNotNull($resource);
        $this->assertArrayHasKey('latest_status', $resource);
        $this->assertSame('6', $resource['latest_status']['staffing_value1']);
    }

    public function test_summary_returns_crews_ordered_by_name(): void
    {
        $response = $this->apiGet('/api/summary');

        $response->assertOk();

        $names = collect($response->json())->pluck('name')->all();
        $sorted = $names;
        sort($sorted);

        $this->assertSame($sorted, $names);
    }

    public function test_summary_returns_empty_array_when_no_crews_exist(): void
    {
        $this->fixtures->crewWithStatus->delete();
        $this->fixtures->emptyCrew->delete();

        $response = $this->apiGet('/api/summary');

        $response->assertOk();
        $response->assertExactJson([]);
    }
}
