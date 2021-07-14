<?php

namespace App\Events;

use App\Domain\Statuses\ResourceStatus;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

/**
 * Class ResourceStatusUpdated
 * @package App\Events
 */
class ResourceStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var ResourceStatus
     */
    public $resourceStatus;
    public $crewId;

    /**
     * Create a new event instance.
     *
     * @param ResourceStatus $resourceStatus
     */
    public function __construct(ResourceStatus $resourceStatus)
    {
        $this->resourceStatus = $resourceStatus;
        $this->crewId = ($resourceStatus->crew())->id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('publicStatusUpdates');
    }
}
