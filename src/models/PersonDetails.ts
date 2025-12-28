export interface Strength {
    name: string;
    proficiency: string;
    code?: number;
}

export interface Organization {
    name: string;
    picture?: string;
    id?: number | string;
}

export interface Experience {
    id: string;
    category: 'jobs' | 'education' | 'projects';
    name: string;
    organizations?: Organization[];
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
    responsibilities?: any[];
    additionalInfo?: string;
    highlighted?: boolean;
}

export interface Stats {
    jobs: number;
    education: number;
    strengths: number;
}

export interface PersonDetails {
    name: string;
    professionalHeadline: string;
    picture?: string;
    summaryOfBio?: string;
    location?: {
        name: string;
        country: string;
    };
    links?: Array<{
        name: string;
        address: string;
    }>;
    // Extended fields
    strengths?: Strength[];
    experiences?: Experience[];
    stats?: Stats;
}
