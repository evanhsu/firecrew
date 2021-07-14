<?php

namespace App\Domain\Items;

/**
 * This interface should be implemented by any class that can have
 * an item checked out to it (i.e. Person, User, Location)
 *
 **/
interface CanHaveItemsInterface {
	public function items();
	public function getFullNameAttribute();
}

