'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
    const params = useParams() as { id: string };
    const [videoData, setVideoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);

    const linkifyText = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0066cc', textDecoration: 'underline' }}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

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
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eaf6 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
        }}>
            {loading && <p style={{fontSize: 20, color: '#555'}}>Loading...</p>}
            {error && <p style={{color: 'red', fontSize: 18}}>Error: {error}</p>}
            {videoData && videoData.items && videoData.items.length > 0 && (() => {
                const video = videoData.items[0];
                const snippet = video.snippet;
                const stats = video.statistics;
                const thumbnail = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url;
                return (
                    <>
                        <div style={{
                            background: '#f9f9f9',
                            borderRadius: 12,
                            padding: 24,
                            maxWidth: 700,
                            width: '90vw',
                            margin: '0 auto',
                            boxShadow: '0 2px 16px #0002',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <img src={thumbnail} alt={snippet.title} style={{width: '100%', maxWidth: 640, borderRadius: 8, marginBottom: 16, objectFit: 'cover'}} />
                            <div style={{display: 'flex', gap: 24, marginBottom: 12, fontSize: 16, justifyContent: 'center', width: '100%'}}>
                                <span>👁️ {Number(stats.viewCount).toLocaleString()} views</span>
                                <span>👍 {Number(stats.likeCount).toLocaleString()} likes</span>
                                <span>💬 {Number(stats.commentCount).toLocaleString()} comments</span>
                            </div>
                            <h2 style={{margin: '8px 0', textAlign: 'center'}}>{snippet.title}</h2>
                            <p style={{color: '#666', margin: '4px 0', textAlign: 'center'}}>By <b>{snippet.channelTitle}</b> &bull; Published: {new Date(snippet.publishedAt).toLocaleDateString()}</p>
                            <div style={{margin: '12px 0', color: '#333', whiteSpace: 'pre-line', textAlign: 'left', width: '100%'}}>{linkifyText(snippet.description)}</div>
                            {snippet.tags && (
                                <div style={{margin: '12px 0', width: '100%'}}>
                                    <b>Tags:</b> {snippet.tags.slice(0, 10).map((tag: string) => (
                                        <span key={tag} style={{display: 'inline-block', background: '#eee', borderRadius: 4, padding: '2px 8px', margin: '0 4px 4px 0', fontSize: 12}}>{tag}</span>
                                    ))}
                                    {snippet.tags.length > 10 && <span style={{fontSize: 12, color: '#888'}}>+{snippet.tags.length - 10} more</span>}
                                </div>
                            )}
                        </div>
                        <div style={{maxWidth: 700, width: '90vw', margin: '24px auto 0 auto', textAlign: 'center'}}>
                            <button onClick={() => setShowRaw(v => !v)} style={{padding: '10px 20px', borderRadius: 6, border: '1px solid #bbb', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 16, boxShadow: '0 1px 4px #0001'}}>
                                {showRaw ? 'Hide' : 'Show'} Raw Manifest
                            </button>
                            {showRaw && (
                                <pre style={{textAlign: 'left', background: '#222', color: '#fff', padding: 16, borderRadius: 8, marginTop: 12, overflowX: 'auto', fontSize: 13, maxHeight: 400, width: '100%'}}>{JSON.stringify(videoData, null, 2)}</pre>
                            )}
                        </div>
                    </>
                );
            })()}
        </div>
    );
}
