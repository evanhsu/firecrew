<?php
namespace App\Domain\StatusableResources;

class SmokejumperAirplane extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "SmokejumperAirplane";
    protected static $staffing_category1 = "SMKJ";
    protected static $staffing_category1_explanation = "Enter the number of smokejumpers currently available to staff fires.";
    protected static $staffing_category2 = "Load Size";
    protected static $staffing_category2_explanation = "Enter the number of smokejumpers that could be delivered to a fire in a single load.";

    public static function resourceType()
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
}