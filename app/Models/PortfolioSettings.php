<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioSettings extends Model
{
    protected $fillable = [
        'section_order',
        'visible_sections',
    ];

    protected function casts(): array
    {
        return [
            'section_order' => 'array',
            'visible_sections' => 'array',
        ];
    }

    public static $defaultSections = ['hero', 'projects', 'experience', 'education', 'contact'];

    public static function current(): self
    {
        return self::first() ?? new self([
            'section_order' => self::$defaultSections,
            'visible_sections' => self::$defaultSections,
        ]);
    }
}
