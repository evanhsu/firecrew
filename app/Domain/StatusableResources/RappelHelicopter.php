<?php

namespace App\Domain\StatusableResources;

class RappelHelicopter extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "RappelHelicopter";
    protected static $staffing_category1 = "Available Rappellers";
    protected static $staffing_category1_explanation = "Total rappellers available to staff a fire today";
    
    // protected static $staffing_category2 = "HRAP Surplus";
    protected static $staffing_category2 = null;
    protected static $staffing_category2_explanation = "Enter the number of HRAPs that you would be willing to send on a boost. For example: if you have a spotter + 8 rappellers staffing today but you only need 6 rappellers to meet the expected fire load, you would enter '2' in this field.";

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
