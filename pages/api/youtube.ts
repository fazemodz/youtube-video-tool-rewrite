import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoID } = req.query;

  if (!videoID || typeof videoID !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid videoID parameter' });
  }

  try {
    const apiKey = process.env.Youtube_API_Key;
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoID}&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from YouTube API' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
