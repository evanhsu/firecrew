<?php
namespace App\Http\Transformers;

use App\Domain\StatusableResources\AbstractStatusableResource;
use League\Fractal\TransformerAbstract;

class StatusableResourceTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'status',
        'crew'
    ];
    protected $defaultIncludes = [];

    public function transform(AbstractStatusableResource $statusableResource)
    {
        return [
            'id'                => $statusableResource->id,
            'identifier'        => $statusableResource->identifier,
            'resource_type'     => $statusableResource->resource_type,
            'model'             => $statusableResource->model,
            'crew_id'           => $statusableResource->crew_id,
            'created_at'        => $statusableResource->created_at->toIso8601String(),
            'updated_at'        => $statusableResource->updated_at->toIso8601String(),
        ];
    }

    public function includeStatus(AbstractStatusableResource $statusableResource)
    {
        if(!$statusableResource->status()) {
            return null;
        }

        return $this->item(
            $statusableResource->status(),
            new ResourceStatusTransformer,
            'status'
        );
    }

    public function includeCrew(AbstractStatusableResource $statusableResource)
    {
        if(!$statusableResource->crew) {
            return null;
        }

        return $this->item(
            $statusableResource->crew,
            new CrewTransformer,
            'crew'
        );
    }

}
