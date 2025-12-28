import './index.css';
import { Router } from './router/Router';
import { PersonViewModel } from './viewmodels/PersonViewModel';
import { SearchPage } from './views/SearchPage';
import { PersonDetailsPage } from './views/PersonDetailsPage';

class App {
    private router: Router;
    private viewModel: PersonViewModel;

    constructor() {
        this.router = new Router('app-root');

        // ViewModel setup - callbacks can be empty as pages handle rendering now
        this.viewModel = new PersonViewModel(
            () => { }, // onPeopleChanged - handled by SearchPage promise if needed
            () => { }  // onPersonSelected - handled by PersonDetailsPage promise
        );

        const searchPage = new SearchPage(this.viewModel);
        const detailsPage = new PersonDetailsPage(this.viewModel);

        // Define Routes
        this.router.addRoute('/', () => {
            searchPage.render(document.getElementById('app-root')!);
        });

        this.router.addRoute('/person/:username', (params) => {
            detailsPage.render(document.getElementById('app-root')!, params);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
