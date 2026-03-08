<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioSettings extends Model
{
    protected $fillable = [
        'section_order',
        'visible_sections',
        'font_heading',
        'font_body',
        'color_scheme',
        'animation_style',
        'section_backgrounds',
        'element_visibility',
        'name_font_size',
        'site_title',
        'favicon_path',
    ];

    protected function casts(): array
    {
        return [
            'section_order' => 'array',
            'visible_sections' => 'array',
            'section_backgrounds' => 'array',
            'element_visibility' => 'array',
            'name_font_size' => 'float',
        ];
    }

    public static $defaultSections = ['hero', 'projects', 'experience', 'education', 'contact'];

    public static $defaultBackgrounds = [
        'hero' => 'default',
        'projects' => 'inverted',
        'experience' => 'default',
        'education' => 'inverted',
        'contact' => 'default',
    ];

    /** Every toggleable element and its default */
    public static $defaultVisibility = [
        // Hero
        'hero_nav' => true,
        'hero_time' => true,
        'hero_tagline' => true,
        'hero_location' => true,
        'hero_status' => true,
        'hero_scroll_hint' => true,
        'hero_line' => true,
        'hero_grain' => true,
        'hero_parallax' => true,
        // Projects
        'projects_progress_bar' => true,
        'projects_counter' => true,
        'projects_tags' => true,
        'projects_status_badge' => true,
        'projects_bg_number' => true,
        'projects_keyboard_hint' => true,
        // Experience
        'experience_count' => true,
        'experience_timeline_dot' => true,
        'experience_type_badge' => true,
        'experience_technologies' => true,
        // Education
        'education_gpa' => true,
        'education_highlights' => true,
        'education_bio' => true,
        // Contact
        'contact_email_scramble' => true,
        'contact_socials' => true,
        'contact_location' => true,
        'contact_footer' => true,
        // Global effects (grouped)
        'effects_cursor' => true,       // cursor_trail, spotlight_cursor, magnetic_buttons
        'effects_scroll' => true,       // smooth_scroll, scroll_progress, section_wipe, text_reveal, staggered_text, back_to_top
        'effects_visual' => true,       // particles, marquee_ticker, parallax_strip, glitch_text, typewriter_subtitle, scramble_headings
        'effects_easter_eggs' => true,  // konami_code
    ];

    public static function current(): self
    {
        return self::first() ?? new self([
            'section_order' => self::$defaultSections,
            'visible_sections' => self::$defaultSections,
            'font_heading' => 'Inter',
            'font_body' => 'Inter',
            'color_scheme' => 'brutalist',
            'animation_style' => 'reveal',
            'section_backgrounds' => self::$defaultBackgrounds,
            'element_visibility' => self::$defaultVisibility,
            'name_font_size' => 14.0,
        ]);
    }
}
