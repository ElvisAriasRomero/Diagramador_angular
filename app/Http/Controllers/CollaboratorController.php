<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

use Inertia\Inertia;

class CollaboratorController extends Controller
{
    /**
     * Agregar un colaborador al proyecto.
     */
    public function add(Request $request, Project $project)
    {
        // Validar que quien agrega sea el dueño
        if (auth()->id() !== $project->owner_id) {
            abort(403, 'Solo el dueño puede agregar colaboradores.');
        }

        // Validar datos recibidos
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // No permitir agregar al dueño
        if ($validated['user_id'] == $project->owner_id) {
            return back()->withErrors('No puedes agregarte a ti mismo como colaborador.');
        }

        // Verificar si ya es colaborador
        $alreadyCollaborator = $project->collaborators()->where('user_id', $validated['user_id'])->exists();
        if ($alreadyCollaborator) {
            return back()->withErrors('Este usuario ya es colaborador.');
        }

        // Agregar colaborador
        $project->collaborators()->create([
            'user_id' => $validated['user_id'],
        ]);

        return back()->with('success', 'Colaborador agregado exitosamente.');
    }

    /**
     * Eliminar un colaborador del proyecto.
     */
    public function remove(Project $project, User $user)
    {
        // Validar que quien elimina sea el dueño
        if (auth()->id() !== $project->owner_id) {
            abort(403, 'Solo el dueño puede eliminar colaboradores.');
        }

        // No permitir eliminar al dueño
        if ($user->id === $project->owner_id) {
            return back()->withErrors('No puedes eliminar al dueño del proyecto.');
        }

        // Eliminar colaborador
        $project->collaborators()->where('user_id', $user->id)->delete();

        return back()->with('success', 'Colaborador eliminado exitosamente.');
    }

    public function manage(Project $project)
{
    $collaborators = $project->collaborators()->with('user')->get();

    $allUsers = \App\Models\User::all(); // Para listar posibles usuarios a agregar

    return Inertia::render('Projects/Collaborators', [
        'project' => $project,
        'collaborators' => $collaborators,
        'allUsers' => $allUsers,
    ]);
}
}
