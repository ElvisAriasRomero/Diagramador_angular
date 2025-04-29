<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Events\DesignUpdated;

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
        $project = $design->project;
        if (!($project->owner_id === auth()->id() || $project->collaborators()->where('user_id', auth()->id())->exists())) {
            \Log::warning('Unauthorized design update attempt', [
                'user_id' => auth()->id(),
                'design_id' => $design->id,
                'project_id' => $project->id
            ]);

            if ($request->wantsJson()) {
                return response()->json(['error' => 'No autorizado para actualizar este diseño'], 403);
            }
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'canvas_data' => 'nullable|json',
        ]);

        try {
            $design->update([
                'name' => $request->name,
                'canvas_data' => $request->canvas_data,
            ]);

            // Emitimos el evento para que todos los conectados al diseño lo reciban
            event(new DesignUpdated($design->id, $design->canvas_data));

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Diseño actualizado correctamente',
                    'design' => $design
                ]);
            }

            return redirect()->route('designs.editor', $design->id)->with('success', 'Diseño actualizado correctamente');

        } catch (\Exception $e) {
            \Log::error('Error updating design:', [
                'design_id' => $design->id,
                'error' => $e->getMessage()
            ]);

            if ($request->wantsJson()) {
                return response()->json(['error' => 'Error al actualizar el diseño'], 500);
            }

            return back()->with('error', 'Error al actualizar el diseño');
        }
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
