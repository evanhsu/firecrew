<?php

namespace App\Domain\StatusableResources;

class RappelHelicopter extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "RappelHelicopter";
    protected static $staffing_category1 = "Staffing";
    protected static $staffing_category1_explanation = "Total rappellers attached to this aircraft.";
    
    // protected static $staffing_category2 = "HRAP Surplus";
    protected static $staffing_category2 = "Boosters In";
    protected static $staffing_category2_explanation = "The number of boosters that are currently reinforcing this aircraft";

    // protected static $staffing_category3 = "HRAPs Committed";
    protected static $staffing_category3 = null;
    protected static $staffing_category3_explanation = "Enter the number of HRAPs that are currently committed to IA fires, project fires, or other assignments.";

    public static function resourceType():string
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
