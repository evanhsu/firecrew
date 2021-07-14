<?php
namespace App\Http\Transformers;

use App\Domain\Statuses\CrewStatus;
use League\Fractal\TransformerAbstract;

class CrewStatusTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'crew',
    ];
    protected $defaultIncludes = [];

    public function transform(CrewStatus $crewStatus)
    {
        return [
            'id'                    => $crewStatus->id,
            'crew_id'               => $crewStatus->crew_id,
            'latitude'              => $crewStatus->latitude,
            'longitude'             => $crewStatus->longitude,
            'popup_content'         => $crewStatus->popup_content,
            'intel'                 => $crewStatus->intel,
            'personnel_1_name'      => $crewStatus->personnel_1_name,
            'personnel_1_role'      => $crewStatus->personnel_1_role,
            'personnel_1_location'  => $crewStatus->personnel_1_location,
            'personnel_1_note'      => $crewStatus->personnel_1_note,
            'personnel_2_name'      => $crewStatus->personnel_2_name,
            'personnel_2_role'      => $crewStatus->personnel_2_role,
            'personnel_2_location'  => $crewStatus->personnel_2_location,
            'personnel_2_note'      => $crewStatus->personnel_2_note,
            'personnel_3_name'      => $crewStatus->personnel_3_name,
            'personnel_3_role'      => $crewStatus->personnel_3_role,
            'personnel_3_location'  => $crewStatus->personnel_3_location,
            'personnel_3_note'      => $crewStatus->personnel_3_note,
            'personnel_4_name'      => $crewStatus->personnel_4_name,
            'personnel_4_role'      => $crewStatus->personnel_4_role,
            'personnel_4_location'  => $crewStatus->personnel_4_location,
            'personnel_4_note'      => $crewStatus->personnel_4_note,
            'personnel_5_name'      => $crewStatus->personnel_5_name,
            'personnel_5_role'      => $crewStatus->personnel_5_role,
            'personnel_5_location'  => $crewStatus->personnel_5_location,
            'personnel_5_note'      => $crewStatus->personnel_5_note,
            'personnel_6_name'      => $crewStatus->personnel_6_name,
            'personnel_6_role'      => $crewStatus->personnel_6_role,
            'personnel_6_location'  => $crewStatus->personnel_6_location,
            'personnel_6_note'      => $crewStatus->personnel_6_note,
            'created_by_name'       => $crewStatus->created_by_name,
            'created_by_id'         => $crewStatus->created_by_id,
            'created_at'            => $crewStatus->created_at->toIso8601String(),
            'updated_at'            => $crewStatus->updated_at->toIso8601String(),
        ];
    }

    public function includeCrew(CrewStatus $crewStatus)
    {
        return $this->item(
            $crewStatus->crew,
            new CrewTransformer,
            'crew'
        );
    }
}
