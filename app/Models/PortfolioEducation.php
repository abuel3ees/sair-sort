<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioEducation extends Model
{
    protected $table = 'portfolio_educations';

    protected $fillable = [
        'institution',
        'degree',
        'field',
        'duration',
        'gpa',
        'highlights',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'highlights' => 'array',
        ];
    }
}
