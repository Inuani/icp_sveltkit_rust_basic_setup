import { AuthClient } from '@dfinity/auth-client';
import { goto } from '$app/navigation';

let authClient: AuthClient | null = null;

export const initAuth = async () => {
  authClient = await AuthClient.create();
};

export const isAuthenticated = async () => {
  if (!authClient) await initAuth();
  return authClient.isAuthenticated();
};

function popupCenter({ width, height }: { width: number; height: number }) {
  const top = window.innerHeight / 2 - height / 2 + window.screenY;
  const left = window.innerWidth / 2 - width / 2 + window.screenX;
  return `top=${top},left=${left},width=${width},height=${height}`;
}

export const login = async () => {
    if (!authClient) await initAuth();
    const IIcanisterId = import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID;
    console.log(IIcanisterId);
    console.log(import.meta.env.VITE_BACKEND_CANISTER_ID);
    const identityProvider = import.meta.env.VITE_DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app/#authorize'
    : `http://127.0.0.1:8000/?canisterId=${IIcanisterId}`;
  await authClient?.login({
    identityProvider,
    maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000 * 1000),
    onSuccess: () => {
      goto('/');
    },
    windowOpenerFeatures: popupCenter({ width: 600, height: 600 })
  });
};

export const logout = async () => {
  if (authClient) {
    await authClient.logout();
    window.location.reload();
  }
};
