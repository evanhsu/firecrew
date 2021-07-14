<?php

namespace Tests\Unit;

use App\Domain\Crews\Crew;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\Domain\Items\Item;
use App\Domain\People\Person;
use App\Domain\Vips\Vip;

use Illuminate\Support\Facades\Log;

class ItemTest extends TestCase
{
	use DatabaseMigrations;

    protected $accountableItem;
    protected $bulkItem;
    protected $crew;
    protected $person;
    protected $vip;

    public function setUp()
    {
        parent::setUp();

        $this->items = new \App\Services\ItemsService();

        $this->crew = new Crew();
        $this->crew->name = "Test Crew";
        $this->crew->type = Crew::$types['rappel'];
        $this->crew->region = 6;
        $this->crew->save();

        $this->person = new Person();
        $this->person->first_name = "John";
        $this->person->last_name = "Doe";
        $this->person->save();
        $this->crew->people()->attach($this->person->id, ['year' => '2017']);

        $this->vip = new Vip();
        $this->vip->name = "John Doe";
        $this->vip->contact = "849-223-0982";
        $this->vip->save();

        $this->accountableItem = new Item();
        $this->accountableItem->type = 'accountable';
        $this->accountableItem->category = 'Sleeping bag';
        $this->accountableItem->serial_number = 'abc123';
        $this->accountableItem->crew_id = $this->crew->id;
        $this->accountableItem->color = 'Green';
        $this->accountableItem->size = 'Regular';
        $this->accountableItem->save();

        $this->bulkItem = new Item();
        $this->bulkItem->type = 'bulk';
        $this->bulkItem->category = 'Nomex Pants';
        $this->bulkItem->crew_id = $this->crew->id;
        $this->bulkItem->color = 'Green';
        $this->bulkItem->size = 'Regular';
        $this->bulkItem->quantity = 5;
        $this->bulkItem->restock_trigger = 5;
        $this->bulkItem->restock_to_quantity = 10;
        $this->bulkItem->save();
    }
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testItemCanBeCheckedOutToPerson()
    {
    	$this->accountableItem->checkOutTo($this->person);
        $this->assertNotNull($this->accountableItem->checked_out_to);
        $this->assertTrue($this->accountableItem->checked_out_to->id == $this->person->id);
        $this->assertTrue($this->person->items()->count() == 1);
    }

    public function testPersonCanBeIssuedAnItem()
    {
    	$this->person->issueItem($this->accountableItem);
        $this->person->issueItem($this->accountableItem); // Issue it twice to check idempotency
        $this->assertNotNull($this->accountableItem->checked_out_to);
        $this->assertTrue($this->accountableItem->checked_out_to->id == $this->person->id);
        $this->assertTrue($this->person->items()->count() == 1);
    }

    public function testItemCanBeCheckedOutToVip()
    {
    	$this->accountableItem->checkOutTo($this->vip);
        $this->assertNotNull($this->accountableItem->checked_out_to);
        $this->assertTrue($this->accountableItem->checked_out_to->id == $this->vip->id);
        $this->assertTrue($this->vip->items()->count() == 1);
    }

    public function testVipCanBeIssuedAnItem()
    {
    	$this->vip->issueItem($this->accountableItem);
        $this->assertNotNull($this->accountableItem->checked_out_to);
        $this->assertTrue($this->accountableItem->checked_out_to->id == $this->vip->id);
        $this->assertTrue($this->vip->items()->count() == 1);
    }

    public function testBulkItemQuantityCanBeIncremented()
    {
        $oldQuantity = $this->bulkItem->quantity;
        $this->bulkItem->incrementQuantity();
        $this->assertTrue($this->bulkItem->quantity == ($oldQuantity + 1));
    }

    public function testBulkItemQuantityCanBeDecremented()
    {
        $oldQuantity = $this->bulkItem->quantity;
        $this->bulkItem->decrementQuantity();
        $this->assertTrue($this->bulkItem->quantity == ($oldQuantity - 1));
    }

    public function testBulkItemQuantityWontDecrementBelowZero()
    {
        $this->bulkItem->quantity = 0;
        $this->bulkItem->save();
        $this->assertTrue($this->bulkItem->quantity == 0);
        $this->bulkItem->decrementQuantity();
        $this->assertTrue($this->bulkItem->quantity == 0);
    }

    public function testBulkIssuedItemIsDestroyedWhenDecrementedToZero()
    {
        // Check out the item
        $this->bulkItem->checkOutTo($this->person);
        $bulkIssuedItem = $this->bulkItem->fresh()->issued_items->first();
        $this->assertTrue(!empty($bulkIssuedItem));

        // Check the item back in
        $bulkIssuedItem->checkIn();

        // Confirm that the checked-out item is destroyed
        $bulkIssuedItem = $bulkIssuedItem->fresh();
        $this->assertNull($bulkIssuedItem);
    }

    public function testBulkItemQuantityDecreasesWhenIssuedToAPerson()
    {
        $oldQuantity = $this->bulkItem->quantity;
        $this->bulkItem->checkOutTo($this->person);
        $this->assertTrue($this->bulkItem->quantity == ($oldQuantity - 1));
        $this->bulkItem->checkOutTo($this->person);
        $this->assertTrue($this->bulkItem->fresh()->quantity == ($oldQuantity - 2));
    }

    public function testBulkIssuedItemCreatedWhenBulkItemIsIssuedToAPerson()
    {
        $this->bulkItem->checkOutTo($this->person);
        $bulkIssuedItem = $this->bulkItem->fresh()->issued_items->first();
        $this->assertTrue(!empty($bulkIssuedItem));
        $this->assertTrue($bulkIssuedItem->parent->id == $this->bulkItem->id);
    }

    public function testBulkItemQuantityIncreasesWhenCheckedInFromAPerson()
    {
        $oldQuantity = $this->bulkItem->quantity;
        $this->bulkItem->checkOutTo($this->person);
        $this->assertTrue($this->bulkItem->quantity == ($oldQuantity - 1));

        $this->bulkItem = $this->bulkItem->fresh(); // Refresh model from the db!
        $bulkIssuedItem = $this->bulkItem->issued_items->first();
        $this->assertTrue(!empty($bulkIssuedItem));
        $bulkIssuedItem->checkIn();

        $this->bulkItem = $this->bulkItem->fresh(); // Refresh model from the db!
        $this->assertTrue($this->bulkItem->quantity == $oldQuantity);
    }

    public function testCheckingOutBulkItemMoreThanOnceToSameUserIncrementsUserQuantity()
    {
        // Check out a bulk item to a user and confirm that the user has 1 of that item.
        $bulkIssuedItem = $this->bulkItem->checkOutTo($this->person);
        $this->assertTrue($bulkIssuedItem->quantity == 1);

        // Check the same item out to that user again and confirm that the user has 2 of that item
        // Also confirm that only a single BulkIssuedItem was created (with quantity 2).
        $this->bulkItem->checkOutTo($this->person);
        $this->bulkItem = $this->bulkItem->fresh();
        $bulkIssuedItem = $this->bulkItem->issued_items->first();

        $this->assertTrue($bulkIssuedItem->quantity == 2);
        $this->assertTrue($this->bulkItem->issued_items->count() == 1);
    }
}
