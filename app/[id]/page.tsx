'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const params = useParams() as { id: string };
    const [videoData, setVideoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/youtube?videoID=${params.id}`);
                if (!res.ok) throw new Error('Failed to fetch video data');
                const data = await res.json();
                setVideoData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchVideo();
    }, [params.id]);

    return (
        <div>
            <h1>Search</h1>
            <p>Video ID: {params.id}</p>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            {videoData && (
                <pre style={{textAlign: 'left', background: '#eee', padding: 10}}>{JSON.stringify(videoData, null, 2)}</pre>
            )}
        </div>
    );
}
