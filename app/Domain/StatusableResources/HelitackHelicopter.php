<?php

namespace App\Domain\StatusableResources;

class HelitackHelicopter extends AbstractStatusableResource implements StatusableResourceInterface
{
    protected static $resource_type = "HelitackHelicopter";
    protected static $staffing_category1 = "Crewmembers";
    protected static $staffing_category1_explanation = "Enter the number of HECMs currently staffing this helicopter (not including the acting manager)";
    protected static $staffing_category2 = null;
    protected static $staffing_category2_explanation = null;

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
