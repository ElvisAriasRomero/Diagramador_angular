<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DesignController extends Controller
{
    use AuthorizesRequests;
    public function index(Project $project)
    {
        $designs = $project->designs; // Relación que definimos en el modelo Project
        return Inertia::render('Designs/Index', [
            'project' => $project,
            'designs' => $designs,
        ]);
    }

    public function create(Project $project)
    {
        return Inertia::render('Designs/Create', [
            'project' => $project,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $project->designs()->create([
            'name' => $request->name,
        ]);

        return redirect()->route('projects.designs.index', $project)->with('success', 'Diseño creado exitosamente.');
    }

    public function edit(Project $project, Design $design)
    {
        if ($design->project_id !== $project->id) {
            abort(403);
        }

        return Inertia::render('Designs/Edit', [
            'project' => $project,
            'design' => $design,
        ]);
    }

    public function update(Request $request, Project $project, Design $design)
    {
        if ($design->project_id !== $project->id) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $design->update([
            'name' => $request->name,
        ]);

        return redirect()->route('projects.designs.index', $project)->with('success', 'Diseño actualizado.');
    }

    public function destroy(Project $project, Design $design)
    {
        if ($design->project_id !== $project->id) {
            abort(403);
        }

        $design->delete();

        return redirect()->route('projects.designs.index', $project)->with('success', 'Diseño eliminado.');
    }
}
