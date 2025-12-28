import { Person } from '../models/Person';

export class ApiService {
    private baseUrl: string = '/api/search'; // Proxy path

    async fetchPeople(query: string = ''): Promise<Person[]> {
        if (!query.trim()) {
            return [];
        }

        try {
            // NOTE: Our proxy endpoint /api/search now handles the request to 'https://torre.ai/api/entities/_searchStream'
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    identityType: 'person',
                    limit: 10,
                    meta: true,
                    excludeContacts: true
                })
            });

            if (!response.ok) {
                throw new Error(`Error fetching people: ${response.statusText}`);
            }

            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');

            const people: Person[] = lines.map(line => {
                try {
                    const data = JSON.parse(line);
                    return {
                        ggId: data.ggId || Math.random().toString(),
                        name: data.name || 'Unknown Name',
                        professionalHeadline: data.professionalHeadline || '',
                        imageUrl: data.imageUrl || data.authPic || data.picture,
                        username: data.username,
                        verified: data.verified,
                        weight: data.weight
                    } as Person;
                } catch (e) {
                    console.error('Error parsing JSON line:', e);
                    return null;
                }
            }).filter((p): p is Person => p !== null);

            return people;

        } catch (error) {
            console.error('ApiService Error:', error);
            throw error;
        }
    }

    async fetchPersonDetails(username: string): Promise<any> {
        try {
            // Proxy path
            const response = await fetch(`/api/bio/${username}`);
            if (!response.ok) {
                throw new Error(`Error fetching person details: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('ApiService Details Error:', error);
            throw error;
        }
    }
}
