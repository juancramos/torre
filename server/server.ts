import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Proxy Search
app.post('/api/search', async (req: Request, res: Response) => {
    try {
        const response = await fetch('https://torre.ai/api/entities/_searchStream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers if needed
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            return res.status(response.status).send(await response.text());
        }

        // The Torre API returns NDJSON (streaming). 
        // We can pipe it or just read text. For simplicity in this proxy, lets read text and send it back.
        // Or better, pipe the stream.
        // Node generic fetch (if Node 18+) supports standard web streams. 
        // But express .send() expects string or buffer.
        // Let's get text.
        const text = await response.text();
        res.send(text);

    } catch (error) {
        console.error('Proxy Search Error:', error);
        res.status(500).send('Proxy Error');
    }
});

// Proxy Bio
app.get('/api/bio/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const response = await fetch(`https://torre.ai/api/genome/bios/${username}`);

        if (!response.ok) {
            return res.status(response.status).send(await response.text());
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Bio Error:', error);
        res.status(500).send('Proxy Error');
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
