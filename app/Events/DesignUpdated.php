<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DesignUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $designId;
    public $canvasData;

    public function __construct($designId, $canvasData)
    {
        $this->designId = $designId;
        $this->canvasData = $canvasData;
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('design.' . $this->designId);
    }

    public function broadcastAs(): string
    {
        return 'DesignUpdated';
    }
}
