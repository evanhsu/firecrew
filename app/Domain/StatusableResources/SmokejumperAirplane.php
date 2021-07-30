<?php
namespace App\Domain\StatusableResources;

class SmokejumperAirplane extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "SmokejumperAirplane";
    protected static $staffing_category1 = "SMKJ";
    protected static $staffing_category1_explanation = "Enter the number of smokejumpers currently available to staff fires.";
    protected static $staffing_category2 = "Load Size";
    protected static $staffing_category2_explanation = "Enter the number of smokejumpers that could be delivered to a fire in a single load.";
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
