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
        'name_font_size',
    ];

    protected function casts(): array
    {
        return [
            'section_order' => 'array',
            'visible_sections' => 'array',
            'name_font_size' => 'float',
        ];
    }

    public static $defaultSections = ['hero', 'projects', 'experience', 'education', 'contact'];

    public static function current(): self
    {
        return self::first() ?? new self([
            'section_order' => self::$defaultSections,
            'visible_sections' => self::$defaultSections,
            'font_heading' => 'Inter',
            'font_body' => 'Inter',
            'color_scheme' => 'brutalist',
            'animation_style' => 'reveal',
            'name_font_size' => 14.0,
        ]);
    }
}
