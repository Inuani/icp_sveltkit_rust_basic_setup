import { writable, derived, type Readable } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';
import { goto } from '$app/navigation';
import {
  AUTH_POPUP_WIDTH,
  AUTH_POPUP_HEIGHT,
  AUTH_MAX_TIME_TO_LIVE,
  localIdentityCanisterId,
} from '$lib/constants';
import type { Identity } from '@dfinity/agent';

type OptionIdentity = Identity | undefined | null;

export interface AuthStoreData {
  identity: OptionIdentity;
}

let authClient: AuthClient | undefined | null;

export interface AuthStore extends Readable<AuthStoreData> {
  sync: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

// function popupCenter({ width, height }: { width: number; height: number }) {
//                 const top = window.innerHeight / 2 - height / 2 + window.screenY;
//                 const left = window.innerWidth / 2 - width / 2 + window.screenX;
//                 return `top=${top},left=${left},width=${width},height=${height}`;
//               }

import { browser } from '$app/environment';
import { isNullish } from '@dfinity/utils';

              export const popupCenter = ({
                width,
                height
              }: {
                width: number;
                height: number;
              }): string | undefined => {
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

export const authSignedInStore: Readable<boolean> = derived(
  authStore,
  ($authStore) => $authStore.identity !== null && $authStore.identity !== undefined,
);



// import { AuthClient } from '@dfinity/auth-client';
// import type { Identity } from '@dfinity/agent';
// import { derived, writable, type Readable } from 'svelte/store';
// import { goto } from '$app/navigation';
// import {  AUTH_POPUP_WIDTH,
//           AUTH_POPUP_HEIGHT,
//           AUTH_MAX_TIME_TO_LIVE,
//           localIdentityCanisterId } from '$lib/constants';
          
// const createAuthClient = async (): Promise<AuthClient> =>
//           AuthClient.create();

// type OptionIdentity = Identity | undefined | null;

// export interface AuthStoreData {
// identity: OptionIdentity;
//     }

// let authClient: AuthClient | undefined | null;
          
//           export const authStore = writable<AuthStoreData>({ identity: undefined });
          
//           export async function initAuth() {
//             authClient = await createAuthClient();
//             const isAuthenticated = await authClient.isAuthenticated();
//             authStore.set({ identity: isAuthenticated ? authClient.getIdentity() : null });
//           }
          
//           export async function isAuthenticated() {
//             if (!authClient) await initAuth();
//             return authClient ? authClient.isAuthenticated() : false;
//           }

//           export async function sync() {
//             if (!authClient) await initAuth(); // Ensure authClient is initialized
//             const isAuthenticated = await authClient.isAuthenticated();
//             // Update the authStore based on whether the user is authenticated
//             authStore.set({ identity: isAuthenticated ? authClient.getIdentity() : null });
//           }

//           function popupCenter({ width, height }: { width: number; height: number }) {
//               const top = window.innerHeight / 2 - height / 2 + window.screenY;
//               const left = window.innerWidth / 2 - width / 2 + window.screenX;
//               return `top=${top},left=${left},width=${width},height=${height}`;
//             }
          
//           export async function login() {
//             if (!authClient) await initAuth();
//             const identityProvider = import.meta.env.VITE_DFX_NETWORK === 'ic'
//     ? 'https://identity.ic0.app/#authorize'
//     : `http://127.0.0.1:8000/?canisterId=${localIdentityCanisterId}`;
//     await authClient?.login({
//       identityProvider,
//       maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
//       onSuccess: () => {
//         authStore.update((state) => ({
//           ...state,
//           identity: authClient?.getIdentity(),
//         }));
//         goto('/');
//       },
//       windowOpenerFeatures: popupCenter({ width: AUTH_POPUP_WIDTH, height: AUTH_POPUP_HEIGHT }),
//     });
//   }

//   export async function logout() {
//     if (authClient) {
//       await authClient.logout();
//       authClient = null; // Reset the authClient to ensure proper reinitialization
//       authStore.set({ identity: null }); // Clear the identity in the store
//       window.location.reload();
//     }
//   }
  
//   export const authSignedInStore = derived(
//     authStore,
//     $authStore => $authStore.identity !== null && $authStore.identity !== undefined
//   );