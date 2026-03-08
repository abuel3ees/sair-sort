<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function dashboard()
    {
        $now = Carbon::now();

        // ── Totals ──────────────────────────────────────
        $totalViews     = VisitorLog::where('event', 'page_view')->count();
        $totalDownloads = VisitorLog::where('event', 'cv_download')->count();
        $uniqueVisitors = VisitorLog::where('event', 'page_view')->distinct('ip')->count('ip');

        // Today
        $todayViews     = VisitorLog::where('event', 'page_view')->whereDate('created_at', $now->toDateString())->count();
        $todayDownloads = VisitorLog::where('event', 'cv_download')->whereDate('created_at', $now->toDateString())->count();

        // This week
        $weekViews = VisitorLog::where('event', 'page_view')
            ->where('created_at', '>=', $now->copy()->startOfWeek())
            ->count();

        // ── Views per day (last 30 days) ────────────────
        $viewsPerDay = VisitorLog::where('event', 'page_view')
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->selectRaw("DATE(created_at) as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // Fill in missing days with 0
        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->toDateString();
            $chartData[] = [
                'date'  => $date,
                'views' => $viewsPerDay[$date] ?? 0,
            ];
        }

        // ── Downloads per day (last 30 days) ────────────
        $downloadsPerDay = VisitorLog::where('event', 'cv_download')
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->selectRaw("DATE(created_at) as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        $downloadChartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->toDateString();
            $downloadChartData[] = [
                'date'      => $date,
                'downloads' => $downloadsPerDay[$date] ?? 0,
            ];
        }

        // ── Device breakdown ────────────────────────────
        $devices = VisitorLog::where('event', 'page_view')
            ->selectRaw("device, COUNT(*) as count")
            ->groupBy('device')
            ->pluck('count', 'device')
            ->toArray();

        // ── Top pages ───────────────────────────────────
        $topPages = VisitorLog::where('event', 'page_view')
            ->selectRaw("path, COUNT(*) as count")
            ->groupBy('path')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['path' => '/' . $row->path, 'views' => $row->count])
            ->toArray();

        // ── Top referers ────────────────────────────────
        $topReferers = VisitorLog::where('event', 'page_view')
            ->whereNotNull('referer')
            ->where('referer', '!=', '')
            ->selectRaw("referer, COUNT(*) as count")
            ->groupBy('referer')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['referer' => $row->referer, 'views' => $row->count])
            ->toArray();

        // ── Recent visitors ─────────────────────────────
        $recentVisitors = VisitorLog::where('event', 'page_view')
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($v) => [
                'id'         => $v->id,
                'ip'         => $v->ip,
                'path'       => '/' . $v->path,
                'device'     => $v->device,
                'referer'    => $v->referer,
                'created_at' => $v->created_at->diffForHumans(),
            ])
            ->toArray();

        return Inertia::render('dashboard', [
            'analytics' => [
                'totalViews'        => $totalViews,
                'totalDownloads'    => $totalDownloads,
                'uniqueVisitors'    => $uniqueVisitors,
                'todayViews'        => $todayViews,
                'todayDownloads'    => $todayDownloads,
                'weekViews'         => $weekViews,
                'chartData'         => $chartData,
                'downloadChartData' => $downloadChartData,
                'devices'           => $devices,
                'topPages'          => $topPages,
                'topReferers'       => $topReferers,
                'recentVisitors'    => $recentVisitors,
            ],
        ]);
    }
}
