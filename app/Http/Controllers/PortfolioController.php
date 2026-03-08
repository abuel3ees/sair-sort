<?php

namespace App\Http\Controllers;

use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    // ── Public ──────────────────────────────────────────

    /**
     * Build the portfolio payload used by both the public page and the admin overview.
     */
    public static function portfolioData(): array
    {
        $profile = PortfolioProfile::first();
        $projects = PortfolioProject::orderBy('sort_order')->get();
        $experience = PortfolioExperience::orderBy('sort_order')->get();
        $education = PortfolioEducation::orderBy('sort_order')->get();
        $settings = PortfolioSettings::current();

        return [
            'profile' => $profile ? [
                'name'     => $profile->name,
                'tagline'  => $profile->tagline ?? '',
                'bio'      => $profile->bio ?? '',
                'email'    => $profile->email ?? '',
                'github'   => $profile->github ?? '',
                'linkedin' => $profile->linkedin ?? '',
                'location' => $profile->location ?? '',
                'status'   => $profile->status ?? 'Open to work',
            ] : null,
            'projects' => $projects->map(fn ($p) => [
                'id'              => (string) $p->id,
                'title'           => $p->title,
                'description'     => $p->description ?? '',
                'longDescription' => $p->long_description ?? '',
                'tags'            => $p->tags ?? [],
                'status'          => $p->status,
                'github'          => $p->github,
                'demo'            => $p->demo,
            ])->values()->all(),
            'experience' => $experience->map(fn ($e) => [
                'id'           => (string) $e->id,
                'company'      => $e->company,
                'role'         => $e->role,
                'duration'     => $e->duration,
                'description'  => $e->description ?? '',
                'type'         => $e->type,
                'technologies' => $e->technologies ?? [],
            ])->values()->all(),
            'education' => $education->map(fn ($ed) => [
                'id'          => (string) $ed->id,
                'institution' => $ed->institution,
                'degree'      => $ed->degree,
                'field'       => $ed->field,
                'duration'    => $ed->duration,
                'gpa'         => $ed->gpa,
                'highlights'  => $ed->highlights ?? [],
            ])->values()->all(),
            'settings' => [
                'sectionOrder'    => $settings->section_order ?? PortfolioSettings::$defaultSections,
                'visibleSections' => $settings->visible_sections ?? PortfolioSettings::$defaultSections,
            ],
        ];
    }

    // ── Admin: Overview ─────────────────────────────────

    public function index()
    {
        return Inertia::render('portfolio/index', [
            'portfolio' => self::portfolioData(),
        ]);
    }

    // ── Admin: Profile ──────────────────────────────────

    public function editProfile()
    {
        $profile = PortfolioProfile::first();

        return Inertia::render('portfolio/profile', [
            'profile' => $profile,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'tagline'  => 'nullable|string|max:500',
            'bio'      => 'nullable|string',
            'email'    => 'nullable|email|max:255',
            'github'   => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'status'   => 'nullable|string|max:255',
        ]);

        $profile = PortfolioProfile::first();
        if ($profile) {
            $profile->update($data);
        } else {
            PortfolioProfile::create($data);
        }

        return back()->with('success', 'Profile updated.');
    }

    // ── Admin: Projects ─────────────────────────────────

    public function projectsIndex()
    {
        return Inertia::render('portfolio/projects', [
            'projects' => PortfolioProject::orderBy('sort_order')->get(),
        ]);
    }

    public function storeProject(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'long_description' => 'nullable|string',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string',
            'status'           => 'required|in:completed,in-progress,planned',
            'github'           => 'nullable|url|max:500',
            'demo'             => 'nullable|url|max:500',
            'sort_order'       => 'nullable|integer',
        ]);

        PortfolioProject::create($data);

        return back()->with('success', 'Project created.');
    }

    public function updateProject(Request $request, PortfolioProject $project)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'long_description' => 'nullable|string',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string',
            'status'           => 'required|in:completed,in-progress,planned',
            'github'           => 'nullable|url|max:500',
            'demo'             => 'nullable|url|max:500',
            'sort_order'       => 'nullable|integer',
        ]);

        $project->update($data);

        return back()->with('success', 'Project updated.');
    }

    public function destroyProject(PortfolioProject $project)
    {
        $project->delete();

        return back()->with('success', 'Project deleted.');
    }

    // ── Admin: Experience ───────────────────────────────

    public function experienceIndex()
    {
        return Inertia::render('portfolio/experience', [
            'experiences' => PortfolioExperience::orderBy('sort_order')->get(),
        ]);
    }

    public function storeExperience(Request $request)
    {
        $data = $request->validate([
            'company'      => 'required|string|max:255',
            'role'         => 'required|string|max:255',
            'duration'     => 'required|string|max:255',
            'description'  => 'nullable|string',
            'type'         => 'required|in:full-time,part-time,internship,contract',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
            'sort_order'   => 'nullable|integer',
        ]);

        PortfolioExperience::create($data);

        return back()->with('success', 'Experience created.');
    }

    public function updateExperience(Request $request, PortfolioExperience $experience)
    {
        $data = $request->validate([
            'company'      => 'required|string|max:255',
            'role'         => 'required|string|max:255',
            'duration'     => 'required|string|max:255',
            'description'  => 'nullable|string',
            'type'         => 'required|in:full-time,part-time,internship,contract',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string',
            'sort_order'   => 'nullable|integer',
        ]);

        $experience->update($data);

        return back()->with('success', 'Experience updated.');
    }

    public function destroyExperience(PortfolioExperience $experience)
    {
        $experience->delete();

        return back()->with('success', 'Experience deleted.');
    }

    // ── Admin: Education ────────────────────────────────

    public function educationIndex()
    {
        return Inertia::render('portfolio/education', [
            'educations' => PortfolioEducation::orderBy('sort_order')->get(),
        ]);
    }

    public function storeEducation(Request $request)
    {
        $data = $request->validate([
            'institution'  => 'required|string|max:255',
            'degree'       => 'required|string|max:255',
            'field'        => 'required|string|max:255',
            'duration'     => 'required|string|max:255',
            'gpa'          => 'nullable|string|max:10',
            'highlights'   => 'nullable|array',
            'highlights.*' => 'string',
            'sort_order'   => 'nullable|integer',
        ]);

        PortfolioEducation::create($data);

        return back()->with('success', 'Education created.');
    }

    public function updateEducation(Request $request, PortfolioEducation $education)
    {
        $data = $request->validate([
            'institution'  => 'required|string|max:255',
            'degree'       => 'required|string|max:255',
            'field'        => 'required|string|max:255',
            'duration'     => 'required|string|max:255',
            'gpa'          => 'nullable|string|max:10',
            'highlights'   => 'nullable|array',
            'highlights.*' => 'string',
            'sort_order'   => 'nullable|integer',
        ]);

        $education->update($data);

        return back()->with('success', 'Education updated.');
    }

    public function destroyEducation(PortfolioEducation $education)
    {
        $education->delete();

        return back()->with('success', 'Education deleted.');
    }

    // ── Admin: Sections / Settings ──────────────────────

    public function sectionsIndex()
    {
        $settings = PortfolioSettings::current();

        return Inertia::render('portfolio/sections', [
            'sectionOrder'    => $settings->section_order ?? PortfolioSettings::$defaultSections,
            'visibleSections' => $settings->visible_sections ?? PortfolioSettings::$defaultSections,
        ]);
    }

    public function updateSections(Request $request)
    {
        $data = $request->validate([
            'section_order'      => 'required|array',
            'section_order.*'    => 'string|in:hero,projects,experience,education,contact',
            'visible_sections'   => 'required|array',
            'visible_sections.*' => 'string|in:hero,projects,experience,education,contact',
        ]);

        $settings = PortfolioSettings::first();
        if ($settings) {
            $settings->update($data);
        } else {
            PortfolioSettings::create($data);
        }

        return back()->with('success', 'Sections updated.');
    }
}
