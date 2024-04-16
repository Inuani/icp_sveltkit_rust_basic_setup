import { writable, derived, type Readable } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { isNullish } from '@dfinity/utils';
import type { Identity } from '@dfinity/agent';
import {
  AUTH_POPUP_WIDTH,
  AUTH_POPUP_HEIGHT,
  AUTH_MAX_TIME_TO_LIVE,
  localIdentityCanisterId 
        } from '$lib/constants';


type OptionIdentity = Identity | undefined | null;

export interface AuthStoreData {
  identity: OptionIdentity;
}

let authClient: AuthClient | undefined | null;



export const popupCenter = ({ width, height}: {width: number; height: number;}): string | undefined => {
  if (!browser) {
    return undefined;
  }

  if (isNullish(window) || isNullish(window.top)) {
    return undefined;
  }

  const {
    top: { innerWidth, innerHeight }
  } = window;

  const y = innerHeight / 2 + screenY - height / 2;
  const x = innerWidth / 2 + screenX - width / 2;

  return `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`;
};

export interface AuthStore extends Readable<AuthStoreData> {
  sync: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const initAuthStore = (): AuthStore => {
  
  const { subscribe, set, update } = writable<AuthStoreData>({ identity: undefined });

  return {
    subscribe,

    sync: async () => {
      authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();
      set({
        identity: isAuthenticated ? authClient.getIdentity() : null,
      });
    },

    signIn: async () => {
      if (!authClient) authClient = await AuthClient.create();
      const identityProvider = localIdentityCanisterId
        ? `http://${localIdentityCanisterId}.localhost:8000`
        : 'https://identity.ic0.app/#authorize';
      await authClient.login({
        identityProvider,
        maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
        onSuccess: () => {
          update((data) => ({
            ...data,
            identity: authClient?.getIdentity(),
          }));
          goto('/');
        },
        windowOpenerFeatures: popupCenter({ width: AUTH_POPUP_WIDTH, height: AUTH_POPUP_HEIGHT }),
      });
    },

    signOut: async () => {
      if (authClient) {
        await authClient.logout();
        set({ identity: null });
        window.location.reload();
      }
    },
  };
};

export const authStore = initAuthStore();

export const isUserAuthStore: Readable<boolean> = derived(
  authStore,
  ($authStore) => $authStore.identity !== null && $authStore.identity !== undefined,
);
