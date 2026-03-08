<?php

namespace Database\Seeders;

use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSettings;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        // ── Profile ────────────────────────────────────
        PortfolioProfile::updateOrCreate(['id' => 1], [
            'name'     => 'Abdurahman Al-Essa',
            'tagline'  => 'Full-Stack Engineer & Creative Developer',
            'bio'      => "I build expressive, high-performance web applications that sit at the intersection of design and engineering. Currently exploring the edges of Laravel, React, and real-time systems.\n\nWhen I'm not shipping code I'm probably sketching UI concepts, reading about type systems, or over-engineering my dotfiles.",
            'email'    => 'hello@abdurahman.dev',
            'github'   => 'abdurahmanal-essa',
            'linkedin' => 'abdurahman-al-essa',
            'location' => 'Riyadh, Saudi Arabia',
            'status'   => 'Open to work',
        ]);

        // ── Projects ───────────────────────────────────
        $projects = [
            [
                'title'            => 'Sair',
                'description'      => 'A brutalist portfolio platform with a fully editable admin dashboard.',
                'long_description' => "Sair is a self-hosted portfolio engine built with Laravel and React (Inertia.js). It features a brutalist editorial design system, section reordering, and a real-time admin panel for managing every piece of content.\n\nKey highlights:\n• Dynamic section visibility & ordering\n• Horizontal-scroll project showcase with modals\n• Intersection-observer powered reveal animations\n• Tailwind CSS v4 with oklch color system",
                'tags'             => ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'TypeScript'],
                'status'           => 'in-progress',
                'github'           => 'https://github.com/abdurahmanal-essa/sair',
                'demo'             => null,
                'sort_order'       => 0,
            ],
            [
                'title'            => 'Pulse',
                'description'      => 'Real-time collaborative task board with WebSocket sync.',
                'long_description' => "Pulse is a Trello-inspired project management tool built for small teams. It uses Laravel Reverb for real-time broadcasting and React for an optimistic, drag-and-drop UI.\n\nFeatures:\n• Real-time card movement across boards\n• Optimistic UI updates with rollback\n• Markdown descriptions & file attachments\n• Team invitation & role management",
                'tags'             => ['Laravel', 'React', 'WebSockets', 'Redis', 'PostgreSQL'],
                'status'           => 'completed',
                'github'           => 'https://github.com/abdurahmanal-essa/pulse',
                'demo'             => 'https://pulse.abdurahman.dev',
                'sort_order'       => 1,
            ],
            [
                'title'            => 'Wasm Playground',
                'description'      => 'In-browser code editor that compiles and runs Rust to WebAssembly.',
                'long_description' => "An experimental web IDE that lets you write Rust in the browser, compile it to WASM on the fly, and see the output instantly. Built as a learning project to explore the WebAssembly ecosystem.\n\nStack:\n• Monaco Editor for code editing\n• wasm-pack compiled Rust toolchain\n• Web Workers for non-blocking compilation\n• Vanilla TypeScript, zero frameworks",
                'tags'             => ['Rust', 'WebAssembly', 'TypeScript', 'Monaco Editor'],
                'status'           => 'completed',
                'github'           => 'https://github.com/abdurahmanal-essa/wasm-playground',
                'demo'             => 'https://wasm.abdurahman.dev',
                'sort_order'       => 2,
            ],
            [
                'title'            => 'Noor',
                'description'      => 'Minimal Islamic prayer times & Quran reader as a PWA.',
                'long_description' => "Noor is a progressive web app providing accurate prayer times based on geolocation and a clean, distraction-free Quran reading experience with bookmarking and search.\n\nHighlights:\n• Offline-first with service worker caching\n• Geolocation-based prayer time calculation\n• Beautiful Arabic typography with tashkeel support\n• Dark mode & customizable font sizes",
                'tags'             => ['Next.js', 'PWA', 'TypeScript', 'Tailwind CSS'],
                'status'           => 'completed',
                'github'           => 'https://github.com/abdurahmanal-essa/noor',
                'demo'             => 'https://noor.abdurahman.dev',
                'sort_order'       => 3,
            ],
            [
                'title'            => 'CLI Dashboard',
                'description'      => 'Terminal-based system monitor with Spotify integration.',
                'long_description' => "A Go-powered terminal UI that displays system metrics (CPU, memory, disk, network) alongside your current Spotify track. Uses bubbletea for the TUI framework.\n\nFeatures:\n• Live-updating charts and sparklines\n• Spotify API integration via OAuth\n• Configurable layout via YAML\n• Cross-platform (macOS, Linux)",
                'tags'             => ['Go', 'Bubbletea', 'Spotify API', 'TUI'],
                'status'           => 'planned',
                'github'           => null,
                'demo'             => null,
                'sort_order'       => 4,
            ],
        ];

        foreach ($projects as $project) {
            PortfolioProject::updateOrCreate(
                ['title' => $project['title']],
                $project,
            );
        }

        // ── Experience ─────────────────────────────────
        $experiences = [
            [
                'company'      => 'Tamkeen Technologies',
                'role'         => 'Full-Stack Developer',
                'duration'     => '2024 – Present',
                'description'  => 'Building enterprise SaaS products with Laravel and React. Led the migration of a legacy jQuery front-end to Inertia.js, reducing page load times by 60%. Designed and shipped a real-time notification system serving 10k+ daily active users.',
                'type'         => 'full-time',
                'technologies' => ['Laravel', 'React', 'Inertia.js', 'PostgreSQL', 'Redis', 'Docker'],
                'sort_order'   => 0,
            ],
            [
                'company'      => 'Freelance',
                'role'         => 'Web Developer & Designer',
                'duration'     => '2022 – 2024',
                'description'  => 'Delivered 15+ projects for clients across Saudi Arabia and the UAE. Specialized in marketing sites, e-commerce, and custom dashboards. Developed a white-label booking platform used by 3 travel agencies.',
                'type'         => 'contract',
                'technologies' => ['Next.js', 'Laravel', 'Tailwind CSS', 'Stripe', 'Figma'],
                'sort_order'   => 1,
            ],
            [
                'company'      => 'Saudi Digital Academy',
                'role'         => 'Software Engineering Intern',
                'duration'     => 'Summer 2022',
                'description'  => 'Completed an intensive full-stack bootcamp and contributed to an internal learning management system. Implemented the quiz module with automatic grading and analytics dashboards.',
                'type'         => 'internship',
                'technologies' => ['Python', 'Django', 'Vue.js', 'MySQL'],
                'sort_order'   => 2,
            ],
        ];

        foreach ($experiences as $exp) {
            PortfolioExperience::updateOrCreate(
                ['company' => $exp['company'], 'role' => $exp['role']],
                $exp,
            );
        }

        // ── Education ──────────────────────────────────
        $educations = [
            [
                'institution' => 'King Saud University',
                'degree'      => 'Bachelor of Science',
                'field'       => 'Computer Science',
                'duration'    => '2020 – 2024',
                'gpa'         => '3.82 / 4.00',
                'highlights'  => [
                    "Dean's List — 6 consecutive semesters",
                    'Senior capstone: AI-powered Arabic handwriting recognition (95% accuracy)',
                    'Teaching assistant for Data Structures & Algorithms',
                    'ACM ICPC regional participant, 2023',
                ],
                'sort_order' => 0,
            ],
            [
                'institution' => 'Harvard CS50x',
                'degree'      => 'Certificate',
                'field'       => 'Introduction to Computer Science',
                'duration'    => '2021',
                'gpa'         => null,
                'highlights'  => [
                    'Completed all 11 problem sets with top marks',
                    'Final project: multiplayer trivia game in Flask + WebSockets',
                ],
                'sort_order' => 1,
            ],
        ];

        foreach ($educations as $edu) {
            PortfolioEducation::updateOrCreate(
                ['institution' => $edu['institution'], 'degree' => $edu['degree']],
                $edu,
            );
        }

        // ── Section Settings ───────────────────────────
        PortfolioSettings::updateOrCreate(['id' => 1], [
            'section_order'    => ['hero', 'projects', 'experience', 'education', 'contact'],
            'visible_sections' => ['hero', 'projects', 'experience', 'education', 'contact'],
        ]);
    }
}
