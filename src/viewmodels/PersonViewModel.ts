import { Person } from '../models/Person';
import { ApiService } from '../services/ApiService';
import { PersonDetails } from '../models/PersonDetails';

export class PersonViewModel {
    private apiService: ApiService;
    private people: Person[] = [];
    private selectedPerson: PersonDetails | null = null;

    private onPeopleChanged: (people: Person[]) => void;
    private onPersonSelected: (person: PersonDetails | null) => void;

    constructor(
        onPeopleChanged: (people: Person[]) => void,
        onPersonSelected: (person: PersonDetails | null) => void
    ) {
        this.apiService = new ApiService();
        this.onPeopleChanged = onPeopleChanged;
        this.onPersonSelected = onPersonSelected;
    }

    async loadPeople(query: string = ''): Promise<void> {
        try {
            this.people = await this.apiService.fetchPeople(query);
            this.onPeopleChanged(this.people);
        } catch (error) {
            console.error('ViewModel Error:', error);
            this.onPeopleChanged([]);
        }
    }

    async selectPerson(username: string): Promise<PersonDetails | null> {
        if (!username) return null;
        try {
            const data = await this.apiService.fetchPersonDetails(username);
            // Map response to our model
            if (data && data.person) {
                this.selectedPerson = {
                    name: data.person.name,
                    professionalHeadline: data.person.professionalHeadline,
                    picture: data.person.picture,
                    summaryOfBio: data.person.summaryOfBio,
                    location: data.person.location,
                    links: data.person.links,
                    // Map root level fields
                    strengths: data.strengths,
                    experiences: data.experiences,
                    stats: data.stats
                };
                // callback still optional but effectively we are moving to router fetching
                if (this.onPersonSelected) this.onPersonSelected(this.selectedPerson);
                return this.selectedPerson;
            }
            return null;
        } catch (error) {
            console.error('Error selecting person:', error);
            return null;
        }
    }

    clearSelection(): void {
        this.selectedPerson = null;
        this.onPersonSelected(null);
    }

    getPeople(): Person[] {
        return this.people;
    }
}
