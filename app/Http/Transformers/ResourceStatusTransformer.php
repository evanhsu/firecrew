<?php
namespace App\Http\Transformers;

use App\Domain\Statuses\ResourceStatus;
use League\Fractal\TransformerAbstract;

class ResourceStatusTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'statusableResource'
    ];
    protected $defaultIncludes = [];

    public function transform(ResourceStatus $resourceStatus)
    {
        return [
            'id'                        => $resourceStatus->id,
            'statusable_resource_id'    => $resourceStatus->statusable_resource_id,
            'statusable_resource_type'  => $resourceStatus->statusable_resource_type,
            'statusable_resource_name'  => $resourceStatus->statusable_resource_name,
            'crew_name'                 => $resourceStatus->crew_name,
            'latitude'                  => $resourceStatus->latitude,
            'longitude'                 => $resourceStatus->longitude,
            'distance'                  => $resourceStatus->distance,
            'label_text'                => $resourceStatus->label_text,
            'popup_content'             => $resourceStatus->popup_content,
            'staffing_category1'        => $resourceStatus->staffing_category1,
            'staffing_value1'           => $resourceStatus->staffing_value1,
            'staffing_category2'        => $resourceStatus->staffing_category2,
            'staffing_value2'           => $resourceStatus->staffing_value2,
            'manager_name'              => $resourceStatus->manager_name,
            'manager_phone'             => $resourceStatus->manager_phone,
            'comments1'                 => $resourceStatus->comments1,
            'comments2'                 => $resourceStatus->comments2,
            'assigned_fire_name'        => $resourceStatus->assigned_fire_name,
            'assigned_fire_number'      => $resourceStatus->assigned_fire_number,
            'assigned_supervisor'       => $resourceStatus->assigned_supervisor,
            'assigned_supervisor_phone' => $resourceStatus->assigned_supervisor_phone,
            'created_by_name'           => $resourceStatus->created_by_name,
            'created_by_id'             => $resourceStatus->created_by_id,
            'created_at'                => $resourceStatus->created_at->toIso8601String(),
            'updated_at'                => $resourceStatus->updated_at->toIso8601String(),
        ];
    }

    public function includeStatusableResource(ResourceStatus $resourceStatus)
    {
        return $this->item(
            $resourceStatus->resource,
            new StatusableResourceTransformer(),
            'statusableResource'
        );
    }


}
