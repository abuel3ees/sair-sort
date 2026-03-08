<?php

namespace App\Http\Controllers;

use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSettings;
use App\Models\ProjectImage;
use App\Models\VisitorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $projects = PortfolioProject::with('images')->orderBy('sort_order')->get();
        $experience = PortfolioExperience::orderBy('sort_order')->get();
        $education = PortfolioEducation::orderBy('sort_order')->get();
        $settings = PortfolioSettings::current();

        return [
            'profile' => $profile ? [
                'name'         => $profile->name,
                'tagline'      => $profile->tagline ?? '',
                'heroSubtitle' => $profile->hero_subtitle ?? '',
                'bio'          => $profile->bio ?? '',
                'email'        => $profile->email ?? '',
                'github'       => $profile->github ?? '',
                'linkedin'     => $profile->linkedin ?? '',
                'twitter'      => $profile->twitter ?? '',
                'dribbble'     => $profile->dribbble ?? '',
                'website'      => $profile->website ?? '',
                'location'     => $profile->location ?? '',
                'status'       => $profile->status ?? 'Open to work',
                'contactCta'   => $profile->contact_cta ?? "Let's Talk",
                'footerText'   => $profile->footer_text ?? 'Built with Sair',
                'hasCv'        => (bool) $profile->cv_path,
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
                'images'          => $p->images->map(fn ($img) => [
                    'id'           => (string) $img->id,
                    'url'          => asset('storage/' . $img->file_path),
                    'originalName' => $img->original_name,
                    'mimeType'     => $img->mime_type,
                ])->values()->all(),
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
                'sectionOrder'       => $settings->section_order ?? PortfolioSettings::$defaultSections,
                'visibleSections'    => $settings->visible_sections ?? PortfolioSettings::$defaultSections,
                'fontHeading'        => $settings->font_heading ?? 'Inter',
                'fontBody'           => $settings->font_body ?? 'Inter',
                'colorScheme'        => $settings->color_scheme ?? 'brutalist',
                'animationStyle'     => $settings->animation_style ?? 'reveal',
                'nameFontSize'       => (float) ($settings->name_font_size ?? 14.0),
                'siteTitle'          => $settings->site_title ?? '',
                'faviconUrl'         => $settings->favicon_path ? asset('storage/' . $settings->favicon_path) : null,
                'sectionBackgrounds' => $settings->section_backgrounds ?? PortfolioSettings::$defaultBackgrounds,
                'elementVisibility'  => $settings->element_visibility ?? PortfolioSettings::$defaultVisibility,
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
            'name'          => 'required|string|max:255',
            'tagline'       => 'nullable|string|max:500',
            'hero_subtitle' => 'nullable|string|max:500',
            'bio'           => 'nullable|string',
            'email'         => 'nullable|email|max:255',
            'github'        => 'nullable|string|max:255',
            'linkedin'      => 'nullable|string|max:255',
            'twitter'       => 'nullable|string|max:255',
            'dribbble'      => 'nullable|string|max:255',
            'website'       => 'nullable|string|max:255',
            'location'      => 'nullable|string|max:255',
            'status'        => 'nullable|string|max:255',
            'contact_cta'   => 'nullable|string|max:255',
            'footer_text'   => 'nullable|string|max:500',
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
            'projects' => PortfolioProject::with('images')->orderBy('sort_order')->get(),
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
        // Delete all associated images from storage
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->file_path);
        }

        $project->delete();

        return back()->with('success', 'Project deleted.');
    }

    public function uploadProjectImages(Request $request, PortfolioProject $project)
    {
        $request->validate([
            'images'   => 'required|array|max:20',
            'images.*' => 'file|mimes:jpg,jpeg,png,gif,webp,svg,pdf|max:10240',
        ]);

        $maxOrder = $project->images()->max('sort_order') ?? -1;

        $uploaded = [];
        foreach ($request->file('images') as $file) {
            $path = $file->store('project-images', 'public');
            $uploaded[] = $project->images()->create([
                'file_path'     => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type'     => $file->getClientMimeType(),
                'sort_order'    => ++$maxOrder,
            ]);
        }

        return back()->with('success', count($uploaded) . ' file(s) uploaded.');
    }

    public function deleteProjectImage(PortfolioProject $project, ProjectImage $image)
    {
        if ($image->portfolio_project_id !== $project->id) {
            abort(403);
        }

        Storage::disk('public')->delete($image->file_path);
        $image->delete();

        return back()->with('success', 'Image removed.');
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

    // ── CV Upload ───────────────────────────────────────

    public function uploadCv(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:10240', // 10MB max
        ]);

        $profile = PortfolioProfile::first();
        if (! $profile) {
            return back()->withErrors(['cv' => 'Create a profile first.']);
        }

        // Delete old CV if exists
        if ($profile->cv_path) {
            Storage::disk('public')->delete($profile->cv_path);
        }

        $path = $request->file('cv')->store('cv', 'public');
        $profile->update(['cv_path' => $path]);

        return back()->with('success', 'CV uploaded.');
    }

    public function deleteCv()
    {
        $profile = PortfolioProfile::first();
        if ($profile && $profile->cv_path) {
            Storage::disk('public')->delete($profile->cv_path);
            $profile->update(['cv_path' => null]);
        }

        return back()->with('success', 'CV removed.');
    }

    // ── Public CV Download (tracked) ────────────────────

    public function downloadCv(Request $request)
    {
        $profile = PortfolioProfile::first();

        if (! $profile || ! $profile->cv_path || ! Storage::disk('public')->exists($profile->cv_path)) {
            abort(404, 'CV not found.');
        }

        // Track the download
        VisitorLog::create([
            'ip'         => $request->ip(),
            'path'       => 'cv/download',
            'method'     => 'GET',
            'user_agent' => $request->userAgent(),
            'referer'    => $request->header('referer'),
            'device'     => VisitorLog::detectDevice($request->userAgent()),
            'event'      => 'cv_download',
        ]);

        $name = str_replace(' ', '_', $profile->name) . '_CV.pdf';

        return Storage::disk('public')->download($profile->cv_path, $name);
    }

    // ── JSON Import ─────────────────────────────────────

    public function importJson(Request $request)
    {
        $request->validate([
            'json_file' => 'required|file|mimes:json,txt|max:2048',
        ]);

        $content = file_get_contents($request->file('json_file')->getRealPath());
        $data = json_decode($content, true);

        if (! $data) {
            return back()->withErrors(['json_file' => 'Invalid JSON file.']);
        }

        // Import profile
        if (isset($data['profile'])) {
            $p = $data['profile'];
            PortfolioProfile::updateOrCreate(['id' => 1], [
                'name'          => $p['name'] ?? 'Unnamed',
                'tagline'       => $p['tagline'] ?? null,
                'hero_subtitle' => $p['hero_subtitle'] ?? $p['heroSubtitle'] ?? null,
                'bio'           => $p['bio'] ?? null,
                'email'         => $p['email'] ?? null,
                'github'        => $p['github'] ?? null,
                'linkedin'      => $p['linkedin'] ?? null,
                'twitter'       => $p['twitter'] ?? null,
                'dribbble'      => $p['dribbble'] ?? null,
                'website'       => $p['website'] ?? null,
                'location'      => $p['location'] ?? null,
                'status'        => $p['status'] ?? 'Open to work',
                'contact_cta'   => $p['contact_cta'] ?? $p['contactCta'] ?? null,
                'footer_text'   => $p['footer_text'] ?? $p['footerText'] ?? null,
            ]);
        }

        // Import projects
        if (isset($data['projects']) && is_array($data['projects'])) {
            foreach ($data['projects'] as $i => $proj) {
                PortfolioProject::updateOrCreate(
                    ['title' => $proj['title'] ?? "Project $i"],
                    [
                        'description'      => $proj['description'] ?? null,
                        'long_description' => $proj['long_description'] ?? $proj['longDescription'] ?? null,
                        'tags'             => $proj['tags'] ?? [],
                        'status'           => $proj['status'] ?? 'planned',
                        'github'           => $proj['github'] ?? null,
                        'demo'             => $proj['demo'] ?? null,
                        'sort_order'       => $i,
                    ],
                );
            }
        }

        // Import experience
        if (isset($data['experience']) && is_array($data['experience'])) {
            foreach ($data['experience'] as $i => $exp) {
                PortfolioExperience::updateOrCreate(
                    ['company' => $exp['company'] ?? "Company $i", 'role' => $exp['role'] ?? 'Role'],
                    [
                        'duration'     => $exp['duration'] ?? '',
                        'description'  => $exp['description'] ?? null,
                        'type'         => $exp['type'] ?? 'full-time',
                        'technologies' => $exp['technologies'] ?? [],
                        'sort_order'   => $i,
                    ],
                );
            }
        }

        // Import education
        if (isset($data['education']) && is_array($data['education'])) {
            foreach ($data['education'] as $i => $edu) {
                PortfolioEducation::updateOrCreate(
                    ['institution' => $edu['institution'] ?? "Institution $i"],
                    [
                        'degree'     => $edu['degree'] ?? '',
                        'field'      => $edu['field'] ?? '',
                        'duration'   => $edu['duration'] ?? '',
                        'gpa'        => $edu['gpa'] ?? null,
                        'highlights' => $edu['highlights'] ?? [],
                        'sort_order' => $i,
                    ],
                );
            }
        }

        return back()->with('success', 'Portfolio data imported successfully.');
    }

    // ── Admin: Appearance (fonts, colors, animations) ───

    public function appearanceIndex()
    {
        $settings = PortfolioSettings::current();
        $profile = PortfolioProfile::first();

        return Inertia::render('portfolio/appearance', [
            'settings' => [
                'font_heading'        => $settings->font_heading ?? 'Inter',
                'font_body'           => $settings->font_body ?? 'Inter',
                'color_scheme'        => $settings->color_scheme ?? 'brutalist',
                'animation_style'     => $settings->animation_style ?? 'reveal',
                'name_font_size'      => (float) ($settings->name_font_size ?? 14.0),
                'site_title'          => $settings->site_title ?? '',
                'favicon_path'        => $settings->favicon_path ? asset('storage/' . $settings->favicon_path) : null,
                'section_backgrounds' => $settings->section_backgrounds ?? PortfolioSettings::$defaultBackgrounds,
                'element_visibility'  => $settings->element_visibility ?? PortfolioSettings::$defaultVisibility,
            ],
            'profileName' => $profile->name ?? 'Your Name',
        ]);
    }

    public function updateAppearance(Request $request)
    {
        $data = $request->validate([
            'font_heading'          => 'required|string|max:100',
            'font_body'             => 'required|string|max:100',
            'color_scheme'          => 'required|string|max:50',
            'animation_style'       => 'required|string|max:50',
            'name_font_size'        => 'required|numeric|min:3|max:25',
            'site_title'            => 'nullable|string|max:255',
            'section_backgrounds'   => 'nullable|array',
            'section_backgrounds.*' => 'string|in:default,inverted',
            'element_visibility'    => 'nullable|array',
            'element_visibility.*'  => 'boolean',
        ]);

        $settings = PortfolioSettings::first();
        if ($settings) {
            $settings->update($data);
        } else {
            PortfolioSettings::create(array_merge($data, [
                'section_order' => PortfolioSettings::$defaultSections,
                'visible_sections' => PortfolioSettings::$defaultSections,
            ]));
        }

        return back()->with('success', 'Appearance updated.');
    }

    // ── Favicon Upload / Delete ─────────────────────────

    public function uploadFavicon(Request $request)
    {
        $request->validate([
            'favicon' => 'required|file|mimes:ico,png,svg,jpg,jpeg,gif,webp|max:2048',
        ]);

        $settings = PortfolioSettings::first();
        if (! $settings) {
            $settings = PortfolioSettings::create([
                'section_order' => PortfolioSettings::$defaultSections,
                'visible_sections' => PortfolioSettings::$defaultSections,
            ]);
        }

        // Delete old favicon if exists
        if ($settings->favicon_path) {
            Storage::disk('public')->delete($settings->favicon_path);
        }

        $path = $request->file('favicon')->store('favicon', 'public');
        $settings->update(['favicon_path' => $path]);

        return back()->with('success', 'Favicon uploaded.');
    }

    public function deleteFavicon()
    {
        $settings = PortfolioSettings::first();
        if ($settings && $settings->favicon_path) {
            Storage::disk('public')->delete($settings->favicon_path);
            $settings->update(['favicon_path' => null]);
        }

        return back()->with('success', 'Favicon removed.');
    }

    // ── Admin: Live Preview Data ────────────────────────

    public function previewData()
    {
        return response()->json(self::portfolioData());
    }
}
