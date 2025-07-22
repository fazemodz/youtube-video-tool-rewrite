'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface VideoSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        high: { url: string; width: number; height: number };
        standard: { url: string; width: number; height: number };
        maxres: { url: string; width: number; height: number };
    };
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
        title: string;
        description: string;
    };
    defaultAudioLanguage: string;
}

interface VideoStatistics {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
}

interface VideoItem {
    kind: string;
    etag: string;
    id: string;
    snippet: VideoSnippet;
    contentDetails: {
        duration: string;
        dimension: string;
        definition: string;
        caption: string;
        licensedContent: boolean;
        contentRating: Record<string, unknown>;
        projection: string;
    };
    statistics: VideoStatistics;
}

interface VideoData {
    kind: string;
    etag: string;
    items: VideoItem[];
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
}

export default function Page() {
    const params = useParams() as { id: string };
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        }
    };

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
                        style={{ 
                            color: darkMode ? '#60a5fa' : '#0066cc', 
                            textDecoration: 'underline' 
                        }}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    useEffect(() => {
        // Set mounted to true after component mounts
        setMounted(true);
        
        // Load dark mode preference from localStorage
        const stored = localStorage.getItem('darkMode');
        if (stored) {
            setDarkMode(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/youtube?videoID=${params.id}`);
                if (!res.ok) throw new Error('Failed to fetch video data');
                const data = await res.json();
                setVideoData(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchVideo();
    }, [params.id]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <div style={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eaf6 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxSizing: 'border-box',
            }}>
                <p style={{fontSize: 20, color: '#555'}}>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: darkMode 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
                : 'linear-gradient(135deg, #f0f4ff 0%, #e8eaf6 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <button 
                onClick={toggleDarkMode}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: darkMode ? '#374151' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#000000',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                }}
            >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            
            {loading && <p style={{fontSize: 20, color: darkMode ? '#d1d5db' : '#555'}}>Loading...</p>}
            {error && <p style={{color: '#ef4444', fontSize: 18}}>Error: {error}</p>}
            {videoData && videoData.items && videoData.items.length > 0 && (() => {
                const video = videoData.items[0];
                const snippet = video.snippet;
                const stats = video.statistics;
                const thumbnail = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url;
                return (
                    <>
                        <div style={{
                            background: darkMode ? '#1f2937' : '#f9f9f9',
                            borderRadius: 12,
                            padding: 24,
                            maxWidth: 700,
                            width: '100%',
                            margin: '0 auto',
                            boxShadow: darkMode ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: darkMode ? '#f9fafb' : '#000000',
                        }}>
                            <div style={{position: 'relative', width: '100%', maxWidth: 640, marginBottom: 16}}>
                                <Image 
                                    src={thumbnail} 
                                    alt={snippet.title} 
                                    width={640}
                                    height={360}
                                    style={{width: '100%', borderRadius: 8, objectFit: 'cover'}}
                                    priority
                                />
                            </div>
                            <div style={{
                                display: 'flex', 
                                gap: 24, 
                                marginBottom: 12, 
                                fontSize: 16, 
                                justifyContent: 'center', 
                                width: '100%',
                                color: darkMode ? '#d1d5db' : '#000000',
                            }}>
                                <span>👁️ {Number(stats.viewCount).toLocaleString()} views</span>
                                <span>👍 {Number(stats.likeCount).toLocaleString()} likes</span>
                                <span>💬 {Number(stats.commentCount).toLocaleString()} comments</span>
                            </div>
                            <h2 style={{
                                margin: '8px 0', 
                                textAlign: 'center',
                                color: darkMode ? '#f9fafb' : '#000000',
                            }}>{snippet.title}</h2>
                            <p style={{
                                color: darkMode ? '#9ca3af' : '#666', 
                                margin: '4px 0', 
                                textAlign: 'center'
                            }}>By <b>{snippet.channelTitle}</b> &bull; Published: {new Date(snippet.publishedAt).toLocaleDateString()}</p>
                            <div style={{
                                margin: '12px 0', 
                                color: darkMode ? '#d1d5db' : '#333', 
                                whiteSpace: 'pre-line', 
                                textAlign: 'left', 
                                width: '100%'
                            }}>{linkifyText(snippet.description)}</div>
                            {snippet.tags && (
                                <div style={{margin: '12px 0', width: '100%'}}>
                                    <b style={{color: darkMode ? '#f9fafb' : '#000000'}}>Tags:</b> {snippet.tags.slice(0, 10).map((tag: string) => (
                                        <span key={tag} style={{
                                            display: 'inline-block', 
                                            background: darkMode ? '#374151' : '#eee', 
                                            color: darkMode ? '#d1d5db' : '#000000',
                                            borderRadius: 4, 
                                            padding: '2px 8px', 
                                            margin: '0 4px 4px 0', 
                                            fontSize: 12
                                        }}>{tag}</span>
                                    ))}
                                    {snippet.tags.length > 10 && <span style={{
                                        fontSize: 12, 
                                        color: darkMode ? '#9ca3af' : '#888'
                                    }}>+{snippet.tags.length - 10} more</span>}
                                </div>
                            )}
                        </div>
                        <div style={{maxWidth: 700, width: '100%', margin: '24px auto 0 auto', textAlign: 'center'}}>
                            <button onClick={() => setShowRaw(v => !v)} style={{
                                padding: '10px 20px', 
                                borderRadius: 6, 
                                border: darkMode ? '1px solid #4b5563' : '1px solid #bbb', 
                                background: darkMode ? '#374151' : '#fff', 
                                color: darkMode ? '#f9fafb' : '#000000',
                                cursor: 'pointer', 
                                fontWeight: 500, 
                                fontSize: 16, 
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                            }}>
                                {showRaw ? 'Hide' : 'Show'} Raw Manifest
                            </button>
                            {showRaw && (
                                <pre style={{
                                    textAlign: 'left', 
                                    background: darkMode ? '#111827' : '#222', 
                                    color: '#fff', 
                                    padding: 16, 
                                    borderRadius: 8, 
                                    marginTop: 12, 
                                    overflowX: 'auto', 
                                    fontSize: 13, 
                                    maxHeight: 400, 
                                    width: '100%'
                                }}>{JSON.stringify(videoData, null, 2)}</pre>
                            )}
                        </div>
                    </>
                );
            })()}
        </div>
    );
}
