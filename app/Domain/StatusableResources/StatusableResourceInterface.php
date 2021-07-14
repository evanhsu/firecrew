<?php

namespace App\Domain\StatusableResources;


interface StatusableResourceInterface
{
    /**
     * @return string   A string describing the type of resource (i.e. 'rappel_helicopter', 'hotshot_crew')
     */
    public static function resourceType();
    public function crew();
    public function users();
    public function statuses();
    public function latestStatus();
    public function status();
    public function freshness();
}