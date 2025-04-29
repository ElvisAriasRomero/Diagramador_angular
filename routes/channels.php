<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Design;

Broadcast::channel('design.{designId}', function ($user, $designId) {
    \Log::info('Broadcast auth', [
        'user_id' => $user?->id,
        'design_id' => $designId,
    ]);
    $design = \App\Models\Design::find($designId);
    if (!$design) {
        \Log::warning('Design not found', ['design_id' => $designId]);
        return false;
    }
    $project = $design->project;
    $hasAccess = $project->owner_id === $user->id ||
                 $project->collaborators()->where('user_id', $user->id)->exists();
    \Log::info('Broadcast access', [
        'user_id' => $user->id,
        'has_access' => $hasAccess,
    ]);
    return $hasAccess;
});