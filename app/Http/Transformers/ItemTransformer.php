<?php
namespace App\Http\Transformers;

use League\Fractal\TransformerAbstract;
use App\Http\Transformers\PersonTransformer;
use App\Domain\Items\Item;

class ItemTransformer extends TransformerAbstract
{
	protected $availableIncludes = [
	'checked_out_to',
	];
	protected $defaultIncludes = [];

	public function transform(Item $item)
	{
		return [
            'id'                => $item->id,
            'crew_id'           => $item->crew_id,
            'parent_id'         => $item->parent_id,
            'serial_number'     => $item->serial_number,
            'quantity'          => $item->quantity,
            'type'              => $item->type,
            'category'          => $item->category,
            'color'             => $item->color,
            'item_size'         => $item->size,
            'description'       => $item->description,
            'condition'         => $item->condition,
            'checked_out_to_id' => $item->checked_out_to_id,
            'checked_out_to_type'=> $item->checked_out_to_type,
            'note'              => $item->note,
            'usable'            => $item->usable,
            'restock_trigger'   => $item->restock_trigger,
            'restock_to_quantity'=> $item->restock_to_quantity,
            'source'            => $item->source,
            'created_at'        => $item->created_at->toIso8601String(),
            'updated_at'        => $item->updated_at->toIso8601String(),
        ];
	}

	public function includeCheckedOutTo(Item $item)
	{
		if(!$item->checked_out_to) {
			return null;
		}

		return $this->item(
			$item->checked_out_to,
			new CheckedOutToTransformer,
			$item->checked_out_to_type
		);
	}
}
