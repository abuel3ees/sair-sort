<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
