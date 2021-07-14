<?php
namespace App\Http\Transformers;

use League\Fractal\TransformerAbstract;
use App\Domain\Items\CanHaveItemsInterface;

class CheckedOutToTransformer extends TransformerAbstract
{
	protected $availableIncludes = [];
	protected $defaultIncludes = [];

	public function transform(CanHaveItemsInterface $checkedOutTo)
	{
		return $checkedOutTo->toArray();
	}

}
