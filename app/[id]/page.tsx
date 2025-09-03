'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useDarkMode from '../utils/useDarkMode';

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
    const [mounted, setMounted] = useState(false);
    const [dark] = useDarkMode();

    useEffect(() => { setMounted(true); }, []);

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
                        className={`${dark ? 'text-blue-400' : 'text-blue-600'} underline`}
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
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchVideo();
    }, [params.id]);

    // Update page title when video data is loaded
    useEffect(() => {
        if (videoData && videoData.items && videoData.items.length > 0) {
            const video = videoData.items[0];
            const videoTitle = video.snippet.title;
            const videoDescription = video.snippet.description;
            
            // Truncate description to reasonable length for title
            const truncatedDescription = videoDescription.length > 50 
                ? videoDescription.substring(0, 50) + '...' 
                : videoDescription;
            
            document.title = `${videoTitle} - ${truncatedDescription} - YouTube Video Tool`;
        } else if (loading) {
            document.title = 'Loading... - YouTube Video Tool';
        } else if (error) {
            document.title = 'Error - YouTube Video Tool';
        } else {
            document.title = 'YouTube Video Tool';
        }
    }, [videoData, loading, error]);

    if (!mounted) return null;

    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center p-5 box-border transition-colors duration-300 ${dark ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-br from-[#f0f4ff] to-[#e8eaf6]'}`}>
            {loading && <p className={`text-[20px] ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Loading...</p>}
            {error && <p className="text-red-500 text-[18px]">Error: {error}</p>}
            {videoData && videoData.items && videoData.items.length > 0 && (() => {
                const video = videoData.items[0];
                const snippet = video.snippet;
                const stats = video.statistics;
                const thumbnail = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url;
                return (
                    <>
                        <div className={`rounded-xl p-6 max-w-[700px] w-full mx-auto shadow-lg flex flex-col items-center ${dark ? 'bg-gray-800 text-gray-100 shadow-black/40' : 'bg-gray-50 text-black shadow-black/10'}`}>
                            <div className="relative w-full max-w-[640px] mb-4">
                                <Image 
                                    src={thumbnail} 
                                    alt={snippet.title} 
                                    width={640}
                                    height={360}
                                    className="w-full rounded-lg object-cover"
                                    priority
                                />
                            </div>
                            <div className={`flex gap-6 mb-3 text-[16px] justify-center w-full ${dark ? 'text-gray-300' : 'text-black'}`}> 
                                <span>👁️ {Number(stats.viewCount).toLocaleString()} views</span>
                                <span>👍 {Number(stats.likeCount).toLocaleString()} likes</span>
                                <span>💬 {Number(stats.commentCount).toLocaleString()} comments</span>
                            </div>
                            <h2 className={`my-2 text-center text-2xl font-semibold ${dark ? 'text-gray-100' : 'text-black'}`}>{snippet.title}</h2>
                            <p className={`text-center my-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>By <b>{snippet.channelTitle}</b> &bull; Published: {new Date(snippet.publishedAt).toLocaleDateString()}</p>
                            <div className={`my-3 whitespace-pre-line text-left w-full ${dark ? 'text-gray-300' : 'text-gray-800'}`}>{linkifyText(snippet.description)}</div>
                            {snippet.tags && (
                                <div className="my-3 w-full">
                                    <b className={`${dark ? 'text-gray-100' : 'text-black'}`}>Tags:</b> {snippet.tags.slice(0, 10).map((tag: string) => (
                                        <span key={tag} className={`inline-block rounded px-2 py-1 mr-1 mb-1 text-xs ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-black'}`}>{tag}</span>
                                    ))}
                                    {snippet.tags.length > 10 && <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>+{snippet.tags.length - 10} more</span>}
                                </div>
                            )}
                        </div>
                        <div className="max-w-[700px] w-full mx-auto mt-6 text-center">
                            <button onClick={() => setShowRaw(v => !v)} className={`px-5 py-2 rounded-md font-medium text-[16px] shadow-sm transition-colors ${dark ? 'border border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600' : 'border border-gray-300 bg-white text-black hover:bg-gray-100'}`}>
                                {showRaw ? 'Hide' : 'Show'} Raw Manifest
                            </button>
                            {showRaw && (
                                <pre className="text-left bg-black text-white p-4 rounded-lg mt-3 overflow-x-auto text-xs max-h-[400px] w-full">
                                    {JSON.stringify(videoData, null, 2)}
                                </pre>
                            )}
                        </div>
                    </>
                );
            })()}
        </div>
    );
}