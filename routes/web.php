<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'portfolio' => PortfolioController::portfolioData(),
    ]);
})->name('home');

// ── Public CV download (tracked) ────────────────────
Route::get('/cv/download', [PortfolioController::class, 'downloadCv'])->name('cv.download');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AnalyticsController::class, 'dashboard'])->name('dashboard');

    // ── Portfolio Admin ─────────────────────────────────
    Route::prefix('portfolio')->name('portfolio.')->group(function () {
        Route::get('/',           [PortfolioController::class, 'index'])->name('index');

        Route::get('/profile',    [PortfolioController::class, 'editProfile'])->name('profile.edit');
        Route::put('/profile',    [PortfolioController::class, 'updateProfile'])->name('profile.update');

        Route::post('/cv/upload',  [PortfolioController::class, 'uploadCv'])->name('cv.upload');
        Route::delete('/cv',       [PortfolioController::class, 'deleteCv'])->name('cv.delete');
        Route::post('/import',     [PortfolioController::class, 'importJson'])->name('import');

        Route::get('/projects',   [PortfolioController::class, 'projectsIndex'])->name('projects.index');
        Route::post('/projects',  [PortfolioController::class, 'storeProject'])->name('projects.store');
        Route::put('/projects/{project}',    [PortfolioController::class, 'updateProject'])->name('projects.update');
        Route::delete('/projects/{project}', [PortfolioController::class, 'destroyProject'])->name('projects.destroy');

        Route::get('/experience',   [PortfolioController::class, 'experienceIndex'])->name('experience.index');
        Route::post('/experience',  [PortfolioController::class, 'storeExperience'])->name('experience.store');
        Route::put('/experience/{experience}',    [PortfolioController::class, 'updateExperience'])->name('experience.update');
        Route::delete('/experience/{experience}', [PortfolioController::class, 'destroyExperience'])->name('experience.destroy');

        Route::get('/education',   [PortfolioController::class, 'educationIndex'])->name('education.index');
        Route::post('/education',  [PortfolioController::class, 'storeEducation'])->name('education.store');
        Route::put('/education/{education}',    [PortfolioController::class, 'updateEducation'])->name('education.update');
        Route::delete('/education/{education}', [PortfolioController::class, 'destroyEducation'])->name('education.destroy');

        Route::get('/sections',  [PortfolioController::class, 'sectionsIndex'])->name('sections.index');
        Route::put('/sections',  [PortfolioController::class, 'updateSections'])->name('sections.update');

        Route::get('/appearance',  [PortfolioController::class, 'appearanceIndex'])->name('appearance.index');
        Route::put('/appearance',  [PortfolioController::class, 'updateAppearance'])->name('appearance.update');

        Route::get('/preview-data', [PortfolioController::class, 'previewData'])->name('preview.data');
    });
});

require __DIR__.'/settings.php';
