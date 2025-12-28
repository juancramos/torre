import { PersonViewModel } from '../viewmodels/PersonViewModel';
import { Person } from '../models/Person';

export class SearchPage {
    private viewModel: PersonViewModel;
    private container: HTMLElement;

    constructor(viewModel: PersonViewModel) {
        this.viewModel = viewModel;
        this.container = document.createElement('div');
    }

    render(root: HTMLElement) {
        root.innerHTML = `
      <h1>Torre People Search</h1>
      <div class="search-container">
          <input type="text" id="search-bar" placeholder="Search for people (e.g. Renan)..." />
          <button id="search-btn">Search</button>
      </div>
      <ul id="job-list"></ul>
    `;

        // Re-attach event listeners
        this.setupEventListeners(root);

        // Restore state if possible, or clear
        // For now, let's keep it simple and just show empty or last search if generic
        // To properly persist state, ViewModel should hold the last query results
        this.renderPeople(root, this.viewModel.getPeople());
    }

    private setupEventListeners(root: HTMLElement) {
        const searchInput = root.querySelector('#search-bar') as HTMLInputElement;
        const searchBtn = root.querySelector('#search-btn') as HTMLButtonElement;

        const performSearch = () => {
            if (!searchInput) return;
            const query = searchInput.value;
            if (query.trim()) {
                const list = root.querySelector('#job-list');
                if (list) list.innerHTML = '<li>Searching...</li>';

                this.viewModel.loadPeople(query).then(() => {
                    this.renderPeople(root, this.viewModel.getPeople());
                });
            }
        };

        if (searchBtn) searchBtn.addEventListener('click', performSearch);
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }
    }

    private renderPeople(root: HTMLElement, people: Person[]) {
        const listElement = root.querySelector('#job-list');
        if (!listElement) return;

        listElement.innerHTML = '';

        if (people.length === 0) {
            // Don't show "No people found" initially if it's just fresh load
            // But for now, if array is empty, it might mean no search yet or no results
            // We can check if we searched.
            return;
        }

        const fragment = document.createDocumentFragment();
        people.forEach(person => {
            const li = document.createElement('li');
            li.className = 'job-item';
            li.style.cursor = 'pointer';

            li.addEventListener('click', () => {
                // Navigate
                window.location.hash = `/person/${person.username || person.ggId}`;
            });

            // Image
            if (person.imageUrl) {
                const img = document.createElement('img');
                img.src = person.imageUrl;
                img.className = 'job-image';
                li.appendChild(img);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'job-image';
                placeholder.style.backgroundColor = '#ddd';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.textContent = (person.name || '?').charAt(0).toUpperCase();
                li.appendChild(placeholder);
            }

            const div = document.createElement('div');
            div.className = 'job-content';

            const name = document.createElement('h3');
            name.textContent = person.name;

            const headline = document.createElement('p');
            headline.textContent = person.professionalHeadline;

            if (person.verified) {
                const verified = document.createElement('span');
                verified.textContent = ' ✓';
                verified.style.color = '#388e3c';
                name.appendChild(verified);
            }

            div.appendChild(name);
            div.appendChild(headline);
            li.appendChild(div);

            fragment.appendChild(li);
        });

        listElement.appendChild(fragment);
    }
}
