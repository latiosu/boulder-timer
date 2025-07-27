import posthog from 'posthog-js';
import { browser } from '$app/environment';

export const load = async () => {
	if (browser) {
		posthog.init('phc_GdtfK5fSw0MieWN11HmniJtEqWjLHJ1l6cW72oTDVwc', {
			api_host: 'https://us.i.posthog.com',
			defaults: '2025-05-24',
			person_profiles: 'always'
		});
	}

	return;
};

export const prerender = true;
