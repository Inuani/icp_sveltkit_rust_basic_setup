import type { Languages } from '$lib/types/languages';
import { browser } from '$app/environment';

export const setLocalStorageItem = ({ key, value }: { key: string; value: string }) => {
	// Pre-rendering guard
	if (!browser) {
		return;
	}

	try {
		localStorage.setItem(key, value);
	} catch (err: unknown) {
		// We use the local storage for the operational part of the app but, not crucial
		console.error(err);
	}
};

export const getLocalStorageLang = (): Languages => {
	try {
		const { lang }: Storage = browser ? localStorage : ({ lang: 'en' } as unknown as Storage);
		return lang;
	} catch (err: unknown) {
		// We use the local storage for the operational part of the app but, not crucial
		console.error(err);
		return 'en';
	}
};
