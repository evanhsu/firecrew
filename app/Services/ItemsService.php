<?php
namespace App\Services;

use App\Domain\Crews\Crew;
use App\Domain\Items\Item;
use App\Exceptions\ItemTypeException;
use Illuminate\Support\Facades\DB;

class ItemsService
{
	public function byCrew(Crew $crew)
	{
		return $crew->items()->with('checked_out_to')->get();
	}

	public function forCrewByCategory(Crew $crew)
	{
		$itemsQuery = $crew->items()->with('checked_out_to')
			->orderBy('category', 'asc')
			->orderBy('serial_number', 'asc')
			->orderBy('description', 'asc')
			->orderBy('size', 'asc')
			->orderBy('color', 'asc');

		$items = $itemsQuery->get();

		$items = $items->count() > 0 ? $items->groupBy('category') : collect();

		$items->transform(function($values, $key) {
			return [ 'name' => $key, 'items' => $values ];
		});

		return $items;
	}

	public function ofCategory(Crew $crew, $category = null)
	{
		$itemsQuery = $crew->items()->with('checked_out_to');

		if($category) {
			$itemsQuery->where('items.category', 'like', $category);
		}

		return $itemsQuery->get();
	}

	public function categories(Crew $crew)
	{
		$categories = $crew->items()
			->select('category')
			->distinct()
			->orderBy('category', 'asc')
			->pluck('category');

		return $categories;
	}

	public function create($attributes)
	{
		return Item::create(
			$attributes
		);
	}

	public function update($id, $attributes)
    {
        return Item::find($id)->update($attributes);
    }

	public function findOrFail($id)
    {
        return Item::find($id);
    }
}
