<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    protected $fillable = [
        'ip',
        'path',
        'method',
        'user_agent',
        'referer',
        'country',
        'device',
        'event',
    ];

    /**
     * Detect device type from user agent.
     */
    public static function detectDevice(?string $userAgent): string
    {
        if (! $userAgent) {
            return 'unknown';
        }

        $ua = strtolower($userAgent);

        if (str_contains($ua, 'mobile') || str_contains($ua, 'android') || str_contains($ua, 'iphone')) {
            return 'mobile';
        }

        if (str_contains($ua, 'tablet') || str_contains($ua, 'ipad')) {
            return 'tablet';
        }

        return 'desktop';
    }
}
