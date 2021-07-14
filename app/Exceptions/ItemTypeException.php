<?php
namespace App\Exceptions;

class ItemTypeException extends \Exception
{
	// Thrown when operations are requested on an Item type that doesn't support them. 
	//  i.e. incrementing the quantity of an 'accountable' item.
}
