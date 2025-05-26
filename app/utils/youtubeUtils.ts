const cleanYoutubeUrl = (url: string): string => {
    // Remove whitespace
    let cleanUrl = url.trim();
    
    // Remove common YouTube URL patterns
    const patterns = [
        'https://www.youtube.com/watch?v=',
        'https://youtu.be/',
        'www.youtube.com/watch?v=',
        'youtu.be/'
    ];
    
    for (const pattern of patterns) {
        if (cleanUrl.includes(pattern)) {
            cleanUrl = cleanUrl.replace(pattern, '');
            // If there are additional URL parameters, remove them
            const ampIndex = cleanUrl.indexOf('&');
            if (ampIndex !== -1) {
                cleanUrl = cleanUrl.substring(0, ampIndex);
            }
            break;
        }
    }
    
    return cleanUrl;
}; 

export default cleanYoutubeUrl;