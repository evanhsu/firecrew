<?php

namespace App\Domain\Items;

use App\Exceptions\ItemTypeException;
use App\Exceptions\UnknownItemTypeException;
use Illuminate\Database\Eloquent\Model;
use App\Domain\Crews\Crew;
use App\Domain\LogEntries\LogEntry;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Item extends Model
{
    /**
     * @var array
     */
    protected $fillable = [
        'type',
        'category',
        'crew_id',
        'parent_id',
        'serial_number',
        'quantity',
        'color',
        'size',
        'description',
        'condition',
        'checked_out_to_id',
        'checked_out_to_type',
        'note',
        'usable',
        'restock_trigger',
        'restock_to_quantity',
        'source',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function logEntries()
    {
        return $this->morphMany(LogEntry::class, 'loggable');
    }

    /**
     * @return BelongsTo
     */
    public function crew()
    {
        return $this->belongsTo(Crew::class);
    }

    /**
     *  For Bulk-Issued items only.
     *  The parent item is the 'bulk' item collection that this 'bulk_issued'
     *  item was issued from.
     * @return BelongsTo
     *
     */
    public function parent()
    {
        return $this->belongsTo(Item::class, 'parent_id');
    }

    /**
     *  For Bulk items only.
     *  Returns the collection of bulk_issued items for whom this Item is the parent.
     * @return HasMany
     */
    public function issued_items()
    {
        return $this->hasMany(Item::class, 'parent_id');
    }

    public function checked_out_to()
    {
        return $this->morphTo();
    }


    /**
     * @return mixed
     * @throws ItemTypeException
     */
    public function incrementQuantity()
    {
        if ($this->type != 'bulk') {
            throw new ItemTypeException('Only bulk items can have their quantity incremented');
        }

        $this->quantity++;
        $this->save();

        return $this->quantity;
    }

    /**
     * @return int
     * @throws ItemTypeException
     */
    public function decrementQuantity()
    {
        if ($this->type != 'bulk') {
            throw new ItemTypeException('Only bulk items can have their quantity decremented');
        }

        if ($this->quantity == 0) {
            return 0;
        }

        $this->quantity--;
        $this->save();

        return $this->quantity;
    }

    /**
     * @return bool
     */
    public function checkIn()
    {
        try {
            switch ($this->type) {
                case 'accountable':
                    $this->checkInAccountableItem();
                    break;

                case 'bulk_issued':
                    $this->checkInBulkIssuedItem();
                    break;
            }
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }

    private function checkInAccountableItem()
    {
        $this->checked_out_to()->dissociate();
        $this->save();
    }

    private function checkInBulkIssuedItem()
    {
        try {
            $this->parent->quantity += 1;
            $this->parent->save();

            $this->quantity -= 1;
            if ($this->quantity == 0) {
                $this->delete();
            } else {
                $this->save();
            }

        } catch (\Exception $e) {
            return false;
        }

        return true;
    }


    /**
     * @param CanHaveItemsAbstract $owner
     * @return bool|Model
     * @throws UnknownItemTypeException
     */
    public function checkOutTo(CanHaveItemsAbstract $owner)
    {
        switch ($this->type) {
            case 'accountable':
                return $this->checkOutAccountableItem($owner);
                break;

            case 'bulk':
                return $this->checkOutBulkItem($owner);
                break;

            // bulk_issued items cannot be transferred directly to another person.
            //  They must be checked in first, then checked out to the new person.
            // case 'bulk_issued':
            //     $this->checkOutBulkIssuedItem($item, $owner);
            //     break;

            default:
                throw new UnknownItemTypeException('Attempted to check out an item of unknown type');
        }
    }

    /**
     * @param CanHaveItemsAbstract $owner
     * @return bool
     */
    private function checkOutAccountableItem(CanHaveItemsAbstract $owner)
    {
        $this->checked_out_to()->associate($owner);
        $this->save();

        return true;
    }

    /**
     * @param CanHaveItemsAbstract $owner
     * @return Model
     * @throws \Exception
     */
    private function checkOutBulkItem(CanHaveItemsAbstract $owner)
    {
        if ($this->quantity <= 0) {
            throw new \Exception('Can\'t checkout item (' . $this->category . ') because quantity is zero.');
        }

        if ($this->issued_items()->pluck('checked_out_to_id')->contains($owner->id)) {
            // Checking out another item to the same user
            return $this->issued_items->where('checked_out_to_id', $owner->id)->first()->checkOutBulkIssuedItem($owner);
        }

        // DB::transaction(function() use($owner) {
        $newChild = $this->replicate();
        $newChild->type = 'bulk_issued';
        $newChild->parent_id = $this->id;
        $newChild->checked_out_to()->associate($owner);
        $newChild->quantity = 1;
        $newChild->save();

        $this->quantity -= 1;
        $this->save();
        // });

        return $newChild;
    }

    /**
     * @param CanHaveItemsAbstract $owner
     * @return $this
     * @throws \Exception
     */
    private function checkOutBulkIssuedItem(CanHaveItemsAbstract $owner)
    {
        if ($this->parent->quantity <= 0) {
            throw new \Exception('Can\'t checkout another ' . $this->category . ' because there are none in stock.');
        }

        DB::transaction(function () {
            $this->quantity += 1;
            $this->save();
            $this->parent->quantity -= 1;
            $this->parent->save();
        });

        return $this;
    }
}
