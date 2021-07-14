<?php
namespace App\Http\Transformers;

use App\Domain\Crews\Crew;
use League\Fractal\TransformerAbstract;

class CrewTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'status',
        'resources',
    ];
    protected $defaultIncludes = [];

    public function transform(Crew $crew)
    {
        return [
            'id'                => $crew->id,
            'name'              => $crew->name,
            'abbreviation'      => $crew->abbreviation,
            'type'              => $crew->type,
            'region'            => $crew->region,
            'phone'             => $crew->phone,
            'fax'               => $crew->fax,
            'logo_filename'     => $crew->logo_filename,
            'address_street1'   => $crew->address_street1,
            'address_street2'   => $crew->address_street2,
            'address_city'      => $crew->address_city,
            'address_state'     => $crew->address_state,
            'address_zip'       => $crew->address_zip,
            'created_at'        => $crew->created_at->toIso8601String(),
            'updated_at'        => $crew->updated_at->toIso8601String(),
        ];
    }

    public function includeStatus(Crew $crew)
    {
        if(!$crew->status) {
            return null;
        }

        return $this->item(
            $crew->status,
            new CrewStatusTransformer,
            'status'
        );
    }

    public function includeResources(Crew $crew)
    {
        return $this->collection(
            $crew->statusableResources,
            new StatusableResourceTransformer,
            'resources'
        );

    }
}
