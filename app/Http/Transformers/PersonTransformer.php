<?php
namespace App\Http\Transformers;

use League\Fractal\TransformerAbstract;
use App\Domain\People\Person;

class PersonTransformer extends TransformerAbstract
{
	protected $availableIncludes = [];
	protected $defaultIncludes = [];

	public function transform(Person $person)
	{
		return [
			'id'				=> $person->id,
			'iqcs_number'		=> $person->iqcs_number,
			'first_name'		=> $person->first_name,
			'last_name'			=> $person->last_name,
			'full_name'			=> $person->full_name,
			'gender'			=> $person->gender,
			'birthdate'			=> is_null($person->birthdate) ? null : $person->birthdate->toIso8601String(),
			'avatar_filename' 	=> $person->avatar_filename,
			'bio'				=> $person->bio,
			'has_purchase_card'	=> (bool)$person->has_purchase_card,
			'temporary'			=> (bool)$person->temporary,
			'created_at'		=> $person->created_at->toIso8601String(),
			'updated_at'		=> $person->updated_at->toIso8601String(),
		];

	}
}
