<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProfile extends Model
{
    protected $fillable = [
        'name',
        'tagline',
        'bio',
        'email',
        'github',
        'linkedin',
        'location',
        'status',
        'cv_path',
    ];
}
