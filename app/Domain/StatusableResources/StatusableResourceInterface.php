<?php

namespace App\Domain\StatusableResources;


interface StatusableResourceInterface
{
    public static function staffingCategory1();
    public static function staffingCategory1Explanation();
    public static function staffingCategory2();
    public static function staffingCategory2Explanation();
    public static function staffingCategory3();
    public static function staffingCategory3Explanation();


    /**
     * @return string   A string describing the type of resource (i.e. 'rappel_helicopter', 'hotshot_crew')
     */
    public static function resourceType(): string;
    public function crew();
    public function users();
    public function statuses();
    public function latestStatus();
    public function status();
    public function freshness();


}
