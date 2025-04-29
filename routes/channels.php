<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('design.{designId}', function ($user, $designId) {
    return true;
});
