
export const AUTH_POPUP_WIDTH = 576;
export const AUTH_POPUP_HEIGHT = 625;

// 7 days in nano seconds
export const AUTH_MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);

export const ONE_TRILLION = 1_000_000_000_000;

export const localIdentityCanisterId: string | null | undefined = import.meta.env
	.VITE_INTERNET_IDENTITY_CANISTER_ID as string | null | undefined;