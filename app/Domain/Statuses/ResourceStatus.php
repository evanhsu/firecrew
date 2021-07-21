<?php

namespace App\Domain\Statuses;

use App\Domain\StatusableResources\AbstractStatusableResource;
use Illuminate\Database\Eloquent\Model;

class ResourceStatus extends Model
{
    // Explicitly define the database table, since 'status' has an awkward plural form
    protected $table = 'resource_statuses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'latitude',
        'longitude',
        'location_name',
        'staffing_category1',
        'staffing_value1',
        'staffing_category2',
        'staffing_value2',
        'staffing_category3',
        'staffing_value3',
        'manager_name',
        'manager_phone',
        'comments1',
        'comments2',
        'assigned_fire_name',
        'assigned_fire_number',
        'assigned_supervisor',
        'assigned_supervisor_phone',
        'distance',
        'label_text',
        'popup_content',
        'crew_name',
        'statusable_resource_id',
        'statusable_resource_type',
        'statusable_resource_name',
        'created_by'
    ];

    protected static function boot()
    {
        parent::boot();
        self::created(function ($model) {
            $model->crew()->touch();
        });
    }

    public function resource()
    {
        return $this->belongsTo(AbstractStatusableResource::class, 'statusable_resource_id');
    }

    public function crew()
    {
        return $this->resource->crew;
    }
}
