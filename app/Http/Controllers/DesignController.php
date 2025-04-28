<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DesignController extends Controller
{
    public function index(Project $project)
    {
        $designs = $project->designs;
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

    public function edit(Design $design)
    {
        if ($design->project->owner_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Designs/Edit', [
            'project' => $design->project,
            'design' => $design,
        ]);

    }

    public function update(Request $request, Design $design)
    {
        if ($design->project->owner_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'canvas_data' => 'nullable|json',
        ]);

        $design->update([
            'name' => $request->name,
            'canvas_data' => $request->canvas_data,
        ]);

        return redirect()->route('projects.designs.index', $design->project)->with('success', 'Diseño actualizado.');
    }

    public function destroy(Design $design)
    {
        if ($design->project->owner_id !== Auth::id()) {
            abort(403);
        }

        $design->delete();

        return redirect()->route('projects.designs.index', $design->project)->with('success', 'Diseño eliminado.');
    }

    public function openEditor(Design $design)
    {
        return Inertia::render('Designs/Editor', [
            'project' => $design->project,
            'design' => $design,
        ]);
    }
}
