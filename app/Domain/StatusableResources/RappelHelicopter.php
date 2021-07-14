<?php

namespace App\Domain\StatusableResources;

class RappelHelicopter extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "RappelHelicopter";
    protected static $staffing_category1 = "Rappellers";
    protected static $staffing_category1_explanation = "Enter the total number of HRAPs currently available to staff fires.";
    protected static $staffing_category2 = "HRAP Surplus";
    protected static $staffing_category2_explanation = "Enter the number of HRAPs that you would be willing to send on a boost. For example: if you have a spotter + 8 rappellers staffing today but you only need 6 rappellers to meet the expected fire load, you would enter '2' in this field.";

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
