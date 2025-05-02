<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CollaboratorController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // 🔥 PROYECTOS PÚBLICOS para usuarios autenticados
    Route::resource('projects', ProjectController::class);

    // Ahora sí protegemos estas rutas
    Route::middleware('can_access_project')->group(function () {
        // DISEÑOS (porque necesitan saber de qué proyecto vienen)
        Route::resource('projects.designs', DesignController::class)->shallow();
        // Route::get('designs/{design}/editor', [DesignController::class, 'openEditor'])->name('designs.editor');

        // Rutas que requieren {project}
// Route::get('/projects/{project}/designs', [DesignController::class, 'index'])->name('projects.designs.index');
// Route::get('/projects/{project}/designs/create', [DesignController::class, 'create'])->name('projects.designs.create');
// Route::post('/projects/{project}/designs', [DesignController::class, 'store'])->name('projects.designs.store');

// // Rutas shallow (solo {design})
// Route::get('/designs/{design}', [DesignController::class, 'show'])->name('designs.show'); // opcional si la usas
// Route::get('/designs/{design}/edit', [DesignController::class, 'edit'])->name('designs.edit');
// Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');


        // COLABORADORES
        Route::get('/projects/{project}/collaborators/manage', [CollaboratorController::class, 'manage'])->name('projects.collaborators.manage');
        Route::post('/projects/{project}/collaborators', [CollaboratorController::class, 'add'])->name('projects.collaborators.add');
        Route::delete('/projects/{project}/collaborators/{user}', [CollaboratorController::class, 'remove'])->name('projects.collaborators.remove');
    });

    Route::get('designs/{design}/editor', [DesignController::class, 'openEditor'])->name('designs.editor');
    Route::put('/designs/{design}', [DesignController::class, 'update'])->name('designs.update');

    // Route::resource('projects.designs', DesignController::class)->shallow();
    // Route::put('/designs/{design}', [DesignController::class, 'update'])->name('designs.update');


});



require __DIR__.'/auth.php';
