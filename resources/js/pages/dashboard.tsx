import { Head } from '@inertiajs/react';
import { Activity, Download, Eye, Monitor, Smartphone, Tablet, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

type ChartPoint = { date: string; views: number };
type DownloadPoint = { date: string; downloads: number };
type TopPage = { path: string; views: number };
type TopReferer = { referer: string; views: number };
type RecentVisitor = {
    id: number;
    ip: string;
    path: string;
    device: string;
    referer: string | null;
    created_at: string;
};

type Analytics = {
    totalViews: number;
    totalDownloads: number;
    uniqueVisitors: number;
    todayViews: number;
    todayDownloads: number;
    weekViews: number;
    chartData: ChartPoint[];
    downloadChartData: DownloadPoint[];
    devices: Record<string, number>;
    topPages: TopPage[];
    topReferers: TopReferer[];
    recentVisitors: RecentVisitor[];
};

function MiniBarChart({ data, dataKey, color = 'var(--foreground)' }: { data: { [key: string]: string | number }[]; dataKey: string; color?: string }) {
    const max = useMemo(() => Math.max(...data.map((d) => Number(d[dataKey]) || 0), 1), [data, dataKey]);

    return (
        <div className="flex items-end gap-px h-16 w-full">
            {data.map((d, i) => {
                const val = Number(d[dataKey]) || 0;
                const pct = (val / max) * 100;
                return (
                    <div
                        key={i}
                        className="flex-1 min-w-0 transition-all duration-300 hover:opacity-70 group relative"
                        style={{ height: `${Math.max(pct, 2)}%`, background: color }}
                        title={`${d.date}: ${val}`}
                    />
                );
            })}
        </div>
    );
}

function DeviceIcon({ device }: { device: string }) {
    switch (device) {
        case 'mobile':
            return <Smartphone className="h-4 w-4" />;
        case 'tablet':
            return <Tablet className="h-4 w-4" />;
        default:
            return <Monitor className="h-4 w-4" />;
    }
}

export default function Dashboard({ analytics }: { analytics?: Analytics }) {
    const a = analytics ?? {
        totalViews: 0,
        totalDownloads: 0,
        uniqueVisitors: 0,
        todayViews: 0,
        todayDownloads: 0,
        weekViews: 0,
        chartData: [],
        downloadChartData: [],
        devices: {},
        topPages: [],
        topReferers: [],
        recentVisitors: [],
    };

    const totalDevices = Object.values(a.devices).reduce((sum, v) => sum + v, 0) || 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* ── Header ─────────────────────────── */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Portfolio analytics and visitor insights.
                    </p>
                </div>

                {/* ── Stat Cards ─────────────────────── */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{a.totalViews.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{a.todayViews} today</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{a.uniqueVisitors.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CV Downloads</CardTitle>
                            <Download className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{a.totalDownloads.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{a.todayDownloads} today</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">{a.weekViews.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Page views</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Charts Row ─────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                            <CardDescription>Last 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {a.chartData.length > 0 ? (
                                <MiniBarChart data={a.chartData} dataKey="views" />
                            ) : (
                                <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
                                    No data yet
                                </div>
                            )}
                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                <span>{a.chartData[0]?.date ?? ''}</span>
                                <span>{a.chartData[a.chartData.length - 1]?.date ?? ''}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Devices</CardTitle>
                            <CardDescription>Visitor breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.keys(a.devices).length > 0 ? (
                                Object.entries(a.devices).map(([device, count]) => (
                                    <div key={device} className="flex items-center gap-3">
                                        <DeviceIcon device={device} />
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="capitalize">{device}</span>
                                                <span className="font-mono text-muted-foreground">
                                                    {Math.round((count / totalDevices) * 100)}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted">
                                                <div
                                                    className="h-full bg-foreground transition-all duration-500"
                                                    style={{ width: `${(count / totalDevices) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No data yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Downloads Chart ─────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">CV Downloads</CardTitle>
                        <CardDescription>Last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {a.downloadChartData.length > 0 ? (
                            <MiniBarChart data={a.downloadChartData} dataKey="downloads" color="var(--accent)" />
                        ) : (
                            <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
                                No downloads yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Tables Row ─────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Top Pages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {a.topPages.length > 0 ? (
                                <div className="space-y-2">
                                    {a.topPages.map((page, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="font-mono text-muted-foreground truncate max-w-50">{page.path}</span>
                                            <span className="font-mono font-medium tabular-nums">{page.views}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No data yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Top Referrers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {a.topReferers.length > 0 ? (
                                <div className="space-y-2">
                                    {a.topReferers.map((ref, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground truncate max-w-62.5">{ref.referer}</span>
                                            <span className="font-mono font-medium tabular-nums">{ref.views}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No referrers yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Recent Visitors ─────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Recent Visitors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {a.recentVisitors.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="pb-2 font-medium">Page</th>
                                            <th className="pb-2 font-medium">Device</th>
                                            <th className="pb-2 font-medium">IP</th>
                                            <th className="pb-2 font-medium text-right">When</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {a.recentVisitors.map((v) => (
                                            <tr key={v.id} className="border-b border-border/50 last:border-0">
                                                <td className="py-2 font-mono">{v.path}</td>
                                                <td className="py-2">
                                                    <span className="flex items-center gap-1.5 capitalize">
                                                        <DeviceIcon device={v.device} />
                                                        {v.device}
                                                    </span>
                                                </td>
                                                <td className="py-2 font-mono text-muted-foreground">{v.ip}</td>
                                                <td className="py-2 text-right text-muted-foreground">{v.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No visitors yet. Share your portfolio link!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
