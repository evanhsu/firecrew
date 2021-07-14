<?php

namespace App\Domain\Statuses;


class Coordinate
{
    protected $latitudeDecimal;
    protected $longitudeDecimal;

    protected $latitudeWholeDegrees;
    protected $latitudeDecimalMinutes;
    protected $latitudeWholeMinutes;

    protected $longitudeWholeDegrees;
    protected $longitudeDecimalMinutes;
    protected $longitudeWholeMinutes;

    public function __construct($latitudeDecimal = null, $longitudeDecimal = null)
    {
        $this->latitudeDecimal = '';
        $this->longitudeDecimal = '';
        $this->latitudeWholeDegrees = '';
        $this->latitudeDecimalMinutes = '';
        $this->latitudeWholeMinutes = '';
        $this->longitudeWholeDegrees = '';
        $this->longitudeDecimalMinutes = '';
        $this->longitudeWholeMinutes = '';

        if (empty($latitudeDecimal) || empty($longitudeDecimal)) {
            return $this;
        }

        $this->latitudeDecimal = $latitudeDecimal;
        $this->longitudeDecimal = $longitudeDecimal;

        // Convert the lat and lon from decimal-degrees into decimal-minutes
        $sign = $latitudeDecimal >= 0 ? 1 : -1; // Keep track of whether the latitude is positive or negative
        $this->latitudeWholeDegrees = floor(abs($this->latitudeDecimal)) * $sign;
        $this->latitudeDecimalMinutes = round((abs($this->latitudeDecimal) - $this->latitudeWholeDegrees) * 60.0, 4);

        $sign = $longitudeDecimal >= 0 ? 1 : -1; // Keep track of whether the longitude is positive or negative
        $this->longitudeWholeDegrees = floor(abs($this->longitudeDecimal)) * $sign * -1; // Convert to 'West-positive' reference
        $this->longitudeDecimalMinutes = round((abs($this->longitudeDecimal) - $this->longitudeWholeDegrees) * 60.0, 4);

        return $this;
    }

    public function asDecimalMinutesStrings()
    {
        return [
            'latitude' => "N" . $this->latitudeWholeDegrees . "° " . $this->latitudeDecimalMinutes . "'",
            'longitude' => "W" . $this->longitudeWholeDegrees . "° " . $this->longitudeDecimalMinutes . "'",
        ];
    }

    public function asDecimalMinutes()
    {
        return [
            'latitude' => [
                'degrees' => $this->latitudeWholeDegrees,
                'minutes' => $this->latitudeDecimalMinutes,
            ],
            'longitude' => [
                'degrees' => $this->longitudeWholeDegrees,
                'minutes' => $this->longitudeDecimalMinutes,
            ],
        ];
    }

    public function asDecimalDegrees()
    {
        return [
            'latitude' => [
                'degrees' => $this->latitudeDecimal,
            ],
            'longitude' => [
                'degrees' => $this->longitudeDecimal,
            ],
        ];
    }
}