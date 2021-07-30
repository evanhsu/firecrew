<?php
namespace App\Domain\StatusableResources;

class ShortHaulHelicopter extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "ShortHaulHelicopter";
    protected static $staffing_category1 = "HAUL";
    protected static $staffing_category1_explanation = "Enter the number of HAUL-qualified crewmembers currently staffing the aircraft.";
    protected static $staffing_category2 = "EMT";
    protected static $staffing_category2_explanation = "Enter the number of EMTs currently staffing the aircraft.";
    protected static $staffing_category3 = null;
    protected static $staffing_category3_explanation = null;

    public static function resourceType(): string
    {
        return self::$resource_type;
    }

    public static function staffingCategory1()
    {
        return self::$staffing_category1;
    }

    public static function staffingCategory1Explanation()
    {
        return self::$staffing_category1_explanation;
    }

    public static function staffingCategory2()
    {
        return self::$staffing_category2;
    }

    public static function staffingCategory2Explanation()
    {
        return self::$staffing_category2_explanation;
    }

    public static function staffingCategory3()
    {
        return self::$staffing_category3;
    }

    public static function staffingCategory3Explanation()
    {
        return self::$staffing_category3_explanation;
    }
}
