<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PortfolioProject extends Model
{
    protected $fillable = [
        'title',
        'description',
        'long_description',
        'tags',
        'status',
        'github',
        'demo',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class, 'portfolio_project_id')->orderBy('sort_order');
    }
}
