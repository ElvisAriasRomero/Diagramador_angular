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
        Route::get('designs/{design}/editor', [DesignController::class, 'openEditor'])->name('designs.editor');

        // COLABORADORES
        Route::get('/projects/{project}/collaborators/manage', [CollaboratorController::class, 'manage'])->name('projects.collaborators.manage');
        Route::post('/projects/{project}/collaborators', [CollaboratorController::class, 'add'])->name('projects.collaborators.add');
        Route::delete('/projects/{project}/collaborators/{user}', [CollaboratorController::class, 'remove'])->name('projects.collaborators.remove');
    });
});

require __DIR__.'/auth.php';
