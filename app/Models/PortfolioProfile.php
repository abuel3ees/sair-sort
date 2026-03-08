<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProfile extends Model
{
    protected $fillable = [
        'name',
        'tagline',
        'hero_subtitle',
        'bio',
        'email',
        'github',
        'linkedin',
        'twitter',
        'dribbble',
        'website',
        'location',
        'status',
        'contact_cta',
        'footer_text',
        'cv_path',
    ];
}
