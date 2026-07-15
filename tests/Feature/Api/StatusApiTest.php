<?php

namespace Tests\Feature\Api;

class StatusApiTest extends ApiTestCase
{
    public function test_status_all_returns_recent_resource_statuses_with_expected_shape(): void
    {
        $response = $this->apiGet('/api/status/all');

        $response->assertOk();

        $payload = $response->json();
        $this->assertIsArray($payload);

        $freshStatus = collect($payload)->firstWhere('statusable_resource_name', 'NREG01');
        $this->assertNotNull($freshStatus);
        $this->assertSame($this->fixtures->freshHelicopter->id, $freshStatus['statusable_resource_id']);
        $this->assertSame('Test Model Astar', $freshStatus['resource']['model']);
        $this->assertSame($this->fixtures->crewWithStatus->id, $freshStatus['crew_id']);
        $this->assertMatchesRegularExpression(
            '/^\d{4}-\d{2}-\d{2}T/',
            $freshStatus['updated_at']
        );
    }

    public function test_status_all_excludes_expired_statuses(): void
    {
        $response = $this->apiGet('/api/status/all');

        $response->assertOk();

        $identifiers = collect($response->json())->pluck('statusable_resource_name');
        $this->assertFalse($identifiers->contains('NEXP01'));
    }

    public function test_status_all_excludes_resources_without_crew_assignment(): void
    {
        $response = $this->apiGet('/api/status/all');

        $response->assertOk();

        $identifiers = collect($response->json())->pluck('statusable_resource_name');
        $this->assertFalse($identifiers->contains('NUNAS01'));
    }

    public function test_status_all_returns_empty_array_when_no_qualifying_statuses_exist(): void
    {
        foreach ($this->fixtures->crewWithStatus->statusableResources as $resource) {
            $resource->statuses()->delete();
        }

        $response = $this->apiGet('/api/status/all');

        $response->assertOk();
        $response->assertExactJson([]);
    }
}
