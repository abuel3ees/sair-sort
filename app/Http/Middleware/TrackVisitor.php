<?php

namespace App\Http\Middleware;

use App\Models\VisitorLog;
use Closure;
use Illuminate\Http\Request;

class TrackVisitor
{
    /**
     * Track page views for public routes only (non-auth, non-admin).
     */
    public function handle(Request $request, Closure $next): mixed
    {
        // Only track GET requests to public pages
        if ($request->isMethod('GET') && ! $request->is('dashboard*', 'portfolio*', 'settings*', 'login', 'register', 'password*', 'two-factor*', 'email*')) {
            VisitorLog::create([
                'ip'         => $request->ip(),
                'path'       => $request->path(),
                'method'     => $request->method(),
                'user_agent' => $request->userAgent(),
                'referer'    => $request->header('referer'),
                'device'     => VisitorLog::detectDevice($request->userAgent()),
                'event'      => 'page_view',
            ]);
        }

        return $next($request);
    }
}
