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
        $projectParam = $request->route('project') ?? $request->route('design');
        $projectId = is_object($projectParam) ? $projectParam->id : $projectParam;

        if (!$projectId) {
            abort(403, 'Proyecto no encontrado.');
        }

        $project = Project::find($projectId);

        if (!$project) {
            abort(404, 'Proyecto no existe.');
        }

        $user = $request->user();

        // Permitir si es dueño
        if ($project->owner_id === $user->id) {
            return $next($request);
        }

        // Permitir si es colaborador
        if ($project->collaborators()->where('user_id', $user->id)->exists()) {
            return $next($request);
        }

        // Si no es dueño ni colaborador, denegar
        abort(403, 'No tienes acceso a este proyecto.');
    }
}
