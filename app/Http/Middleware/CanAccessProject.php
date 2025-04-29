<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Project;

#[MiddlewareName('can_access_project')]
class CanAccessProject
{
    public function handle(Request $request, Closure $next): Response
{
    $projectParam = $request->route('project');
    $designParam = $request->route('design');

    if ($projectParam) {
        $project = is_object($projectParam)
            ? $projectParam
            : Project::find($projectParam);
    } elseif ($designParam && is_object($designParam)) {
        $project = $designParam->project;
    } else {
        abort(403, 'Proyecto no encontrado.');
    }

    if (!$project) {
        abort(404, 'Proyecto no existe.');
    }

    $user = $request->user();

    if ($project->owner_id === $user->id || $project->collaborators()->where('user_id', $user->id)->exists()) {
        return $next($request);
    }

    abort(403, 'No tienes acceso a este proyecto.');
}
}
