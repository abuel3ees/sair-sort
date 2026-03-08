<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioExperience extends Model
{
    protected $fillable = [
        'company',
        'role',
        'duration',
        'description',
        'type',
        'technologies',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'technologies' => 'array',
        ];
    }
}
