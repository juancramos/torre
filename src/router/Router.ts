export class Router {
    private routes: { [path: string]: (params?: any) => void } = {};
    private rootElement: HTMLElement;

    constructor(rootId: string) {
        const el = document.getElementById(rootId);
        if (!el) throw new Error(`Root element ${rootId} not found`);
        this.rootElement = el;
        window.addEventListener('hashchange', this.handleRoute.bind(this));
        window.addEventListener('load', this.handleRoute.bind(this));
    }

    addRoute(path: string, component: (params?: any) => void) {
        this.routes[path] = component;
    }

    private handleRoute() {
        const hash = window.location.hash.slice(1) || '/';

        // Simple exact match or parameter matching
        let matched = false;

        // Check exact match first
        if (this.routes[hash]) {
            this.rootElement.innerHTML = '';
            this.routes[hash]();
            matched = true;
            return;
        }

        // Check dynamic routes (very simple implementation)
        // e.g., route: /person/:username, hash: /person/juan
        for (const route in this.routes) {
            if (route.includes(':')) {
                const routeParts = route.split('/');
                const hashParts = hash.split('/');

                if (routeParts.length === hashParts.length) {
                    const params: any = {};
                    let match = true;

                    for (let i = 0; i < routeParts.length; i++) {
                        if (routeParts[i].startsWith(':')) {
                            const paramName = routeParts[i].slice(1);
                            params[paramName] = hashParts[i];
                        } else if (routeParts[i] !== hashParts[i]) {
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        this.rootElement.innerHTML = '';
                        this.routes[route](params);
                        matched = true;
                        return;
                    }
                }
            }
        }

        if (!matched) {
            this.rootElement.innerHTML = '<h2>404 - Page Not Found</h2>';
        }
    }

    navigate(path: string) {
        window.location.hash = path;
    }
}
