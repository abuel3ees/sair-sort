import { Eye, EyeOff, Maximize2, Minimize2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Device = 'desktop' | 'tablet' | 'mobile';

const deviceWidths: Record<Device, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
};

export function LivePreview() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [visible, setVisible] = useState(false);
    const [device, setDevice] = useState<Device>('desktop');
    const [expanded, setExpanded] = useState(false);

    const refresh = useCallback(() => {
        if (iframeRef.current) {
            iframeRef.current.src = '/?preview=1&t=' + Date.now();
        }
    }, []);

    // Auto-refresh on Inertia form submissions (listen for success events)
    useEffect(() => {
        if (!visible) return;

        const handler = () => {
            // Small delay to let server process changes
            setTimeout(refresh, 500);
        };

        document.addEventListener('inertia:success', handler);
        return () => document.removeEventListener('inertia:success', handler);
    }, [visible, refresh]);

    if (!visible) {
        return (
            <button
                type="button"
                onClick={() => setVisible(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-medium shadow-lg hover:opacity-90 transition-opacity"
            >
                <Eye className="h-4 w-4" />
                Live Preview
            </button>
        );
    }

    return (
        <div
            className={`fixed z-50 bg-background border shadow-2xl flex flex-col transition-all duration-300 ${
                expanded
                    ? 'inset-4'
                    : 'bottom-4 right-4 w-125 h-150'
            }`}
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/50 shrink-0">
                <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground mr-2">Preview</span>
                    {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setDevice(d)}
                            className={`p-1 transition-colors ${device === d ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            title={d}
                        >
                            {d === 'desktop' && <Monitor className="h-3.5 w-3.5" />}
                            {d === 'tablet' && <Tablet className="h-3.5 w-3.5" />}
                            {d === 'mobile' && <Smartphone className="h-3.5 w-3.5" />}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={refresh}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 border"
                        title="Refresh"
                    >
                        ↻
                    </button>
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title={expanded ? 'Minimize' : 'Expand'}
                    >
                        {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setVisible(false)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title="Close"
                    >
                        <EyeOff className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Iframe */}
            <div className="flex-1 overflow-auto bg-muted/20 flex justify-center">
                <iframe
                    ref={iframeRef}
                    src="/?preview=1"
                    className="bg-white dark:bg-black transition-all duration-300 h-full"
                    style={{ width: deviceWidths[device], maxWidth: '100%' }}
                    title="Live Preview"
                />
            </div>
        </div>
    );
}
