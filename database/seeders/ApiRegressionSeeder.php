<?php

namespace Database\Seeders;

use App\Domain\Crews\Crew;
use App\Domain\StatusableResources\RappelHelicopter;
use App\Domain\StatusableResources\ShortHaulHelicopter;
use App\Domain\Users\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ApiRegressionSeeder extends Seeder
{
    public Crew $crewWithStatus;
    public Crew $emptyCrew;
    public ShortHaulHelicopter $freshHelicopter;
    public RappelHelicopter $unassignedHelicopter;
    public User $crewUser;

    public function run(): void
    {
        $this->crewWithStatus = Crew::create([
            'name' => 'API Regression Crew',
            'phone' => '555-0100',
        ]);

        $this->emptyCrew = Crew::create([
            'name' => 'Empty Regression Crew',
        ]);

        $this->crewUser = User::create([
            'name' => 'Regression Tester',
            'email' => 'regression@firecrew.test',
            'password' => bcrypt('password'),
            'crew_id' => $this->crewWithStatus->id,
        ]);

        $this->crewWithStatus->statuses()->create([
            'latitude' => 42.454223,
            'longitude' => -123.310388,
            'intel' => 'API regression crew status',
            'created_by_name' => $this->crewUser->name,
            'created_by_id' => $this->crewUser->id,
        ]);

        $this->freshHelicopter = ShortHaulHelicopter::create([
            'identifier' => 'NREG01',
            'model' => 'Test Model Astar',
            'crew_id' => $this->crewWithStatus->id,
        ]);

        $this->seedResourceStatus($this->freshHelicopter, [
            'latitude' => 42.454223,
            'longitude' => -123.310388,
            'staffing_category1' => 'HAUL',
            'staffing_value1' => '4',
            'manager_name' => 'Test Manager',
            'manager_phone' => '555-0101',
            'assigned_fire_name' => 'Regression Fire',
            'popup_content' => '<p>Fresh status popup</p>',
            'created_at' => Carbon::now()->subDay(),
            'updated_at' => Carbon::now()->subDay(),
        ]);

        $this->seedResourceStatus($this->freshHelicopter, [
            'latitude' => 43.123456,
            'longitude' => -122.654321,
            'staffing_category1' => 'HAUL',
            'staffing_value1' => '6',
            'manager_name' => 'Test Manager',
            'manager_phone' => '555-0101',
            'assigned_fire_name' => 'Regression Fire',
            'popup_content' => '<p>Latest fresh status popup</p>',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $expiredHelicopter = ShortHaulHelicopter::create([
            'identifier' => 'NEXP01',
            'model' => 'Expired Model',
            'crew_id' => $this->crewWithStatus->id,
        ]);

        $this->seedResourceStatus($expiredHelicopter, [
            'latitude' => 40.0,
            'longitude' => -120.0,
            'staffing_value1' => '2',
            'manager_name' => 'Expired Manager',
            'popup_content' => '<p>Expired status</p>',
            'created_at' => Carbon::now()->subDays(21),
            'updated_at' => Carbon::now()->subDays(21),
        ]);

        $this->unassignedHelicopter = RappelHelicopter::create([
            'identifier' => 'NUNAS01',
            'model' => 'Unassigned Bell 205',
            'crew_id' => null,
        ]);

        $this->seedResourceStatus($this->unassignedHelicopter, [
            'latitude' => 41.0,
            'longitude' => -121.0,
            'staffing_value1' => '3',
            'manager_name' => 'Unassigned Manager',
            'popup_content' => '<p>Unassigned resource status</p>',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }

    private function seedResourceStatus(ShortHaulHelicopter|RappelHelicopter $resource, array $attributes): void
    {
        $timestamps = array_intersect_key($attributes, array_flip(['created_at', 'updated_at']));
        $attributes = array_diff_key($attributes, array_flip(['created_at', 'updated_at']));

        $status = $resource->statuses()->create(array_merge([
            'statusable_resource_type' => $resource->resource_type,
            'statusable_resource_name' => $resource->identifier,
            'label_text' => '.',
            'crew_name' => $resource->crew?->name,
            'created_by_name' => $this->crewUser->name,
            'created_by_id' => $this->crewUser->id,
        ], $attributes));

        if ($timestamps !== []) {
            $status->timestamps = false;
            $status->forceFill($timestamps)->save();
        }
    }
}
