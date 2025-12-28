import { PersonViewModel } from '../viewmodels/PersonViewModel';
import { PersonDetails } from '../models/PersonDetails';

export class PersonDetailsPage {
    private viewModel: PersonViewModel;

    constructor(viewModel: PersonViewModel) {
        this.viewModel = viewModel;
    }

    async render(root: HTMLElement, params: any) {
        const username = params.username;

        root.innerHTML = '<div style="text-align:center; padding: 20px;">Loading profile...</div>';

        const person = await this.viewModel.selectPerson(username);

        if (person) {
            this.renderData(root, person);
        } else {
            root.innerHTML = '<div style="text-align:center; padding: 20px;">Error loading profile or user not found. <br> <a href="#/">Go back</a></div>';
        }
    }

    // Real render logic
    renderData(root: HTMLElement, person: PersonDetails) {
        root.innerHTML = `
        <div id="person-details">
            <button id="back-btn" style="margin-bottom: 20px; padding: 10px 20px; cursor: pointer;">&larr; Back to Search</button>
            <div class="job-item" style="display: block;">
                <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px;">
                    <img class="job-image" style="width: 100px; height: 100px;" src="${person.picture || ''}" />
                    <div>
                        <h2 style="margin-top: 0; color: #2c3e50;">${person.name}</h2>
                        <p style="font-size: 1.1em; color: #555;">${person.professionalHeadline || ''}</p>
                        <p style="margin-top: 5px; color: #7f8c8d; font-size: 0.9em;">${person.location ? person.location.name : 'No location info'}</p>
                    </div>
                </div>
                
                <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">Bio</h3>
                <p style="line-height: 1.6;">${person.summaryOfBio || 'No bio available.'}</p>
                
                <div id="skills-section" style="margin-top: 30px;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">Skills & Strengths</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${this.renderSkills(person.strengths)}
                    </div>
                </div>

                <div id="experience-section" style="margin-top: 30px;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">Experience</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${this.renderExperiences(person.experiences, 'jobs')}
                    </ul>
                </div>

                <div id="education-section" style="margin-top: 30px;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">Education</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${this.renderExperiences(person.experiences, 'education')}
                    </ul>
                </div>

                <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; margin-top: 20px;">Links</h3>
                <ul style="list-style: none; padding: 0;">
                    ${(person.links || []).map(link => `<li><a href="${link.address}" target="_blank" style="color: #3498db; text-decoration: none;">${link.name}</a></li>`).join('')}
                </ul>
            </div>
        </div>
     `;

        root.querySelector('#back-btn')?.addEventListener('click', () => {
            window.location.hash = '/';
        });
    }

    private renderSkills(strengths: any[] | undefined): string {
        if (!strengths || strengths.length === 0) return 'No skills listed.';
        return strengths.map(skill => `
        <span style="background-color: #e1f5fe; color: #0277bd; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">
            ${skill.name} (${skill.proficiency})
        </span>
      `).join('');
    }

    private renderExperiences(experiences: any[] | undefined, type: string): string {
        if (!experiences || experiences.length === 0) return '';
        const filtered = experiences.filter(e => e.category === type);
        if (filtered.length === 0) return `<li>No ${type} listed.</li>`;

        return filtered.map(exp => `
        <li style="margin-bottom: 15px; border-left: 3px solid #ddd; padding-left: 10px;">
            <h4 style="margin: 0 0 5px 0; color: #333;">${exp.name}</h4>
            <p style="margin: 0 0 5px 0; font-weight: bold; color: #555;">
                ${exp.organizations && exp.organizations.length > 0 ? exp.organizations[0].name : 'Unknown Organization'}
            </p>
            <p style="font-size: 0.85em; color: #888; margin: 0;">
                ${exp.fromMonth || ''} ${exp.fromYear || ''} - ${exp.toMonth || ''} ${exp.toYear || 'Present'}
            </p>
        </li>
      `).join('');
    }
}
