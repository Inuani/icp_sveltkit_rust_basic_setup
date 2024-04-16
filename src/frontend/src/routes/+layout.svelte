<script lang="ts">
  import { browser } from '$app/environment';
  import { isNullish } from '@dfinity/utils';
  // import { displayAndCleanLogoutMsg, signOut } from '$lib/services/auth.services';

  import { onMount } from 'svelte';
  import { authStore, isUserAuthStore } from '$lib/auth'; 
  import type { AuthStoreData } from '$lib/auth'; 
  import { i18n } from '$lib/stores/i18n.store';
  import type { Languages } from '$lib/types/languages';

const init = async () => {
    await Promise.all([
        i18n.init(), // Initialize internationalization
        syncAuthStore(), // Synchronize the authentication store
        // authStore.sync() // Sync authentication state
    ]);
};

const syncAuthStore = async () => {
    if (!browser) {
        return;
    }

    try {
        await authStore.sync();
    } catch (err: unknown) {
        console.error(err);
    }

    // Optionally, handle logout message display and cleanup
    // displayAndCleanLogoutMsg();
};

const initUser = async ({ identity }: AuthStoreData) => {
    if (isNullish(identity)) {
        return; // Exit if identity is nullish
    }

    // Further user initialization logic could go here
};

onMount(async () => {
    await init();
});

const handleLogin = () => authStore.signIn();
const handleLogout = () => authStore.signOut();
const switchLang = (lang: Languages) => i18n.switchLang(lang);
</script>

<svelte:window on:storage={syncAuthStore} />

<div>
  <button on:click={() => switchLang('en')}>English</button>
  <button on:click={() => switchLang('fr')}>Français</button>
</div>

{#if $isUserAuthStore}
    <button on:click={handleLogout}>{$i18n.core.logout}</button>
{:else}
    <button on:click={handleLogin}>{$i18n.core.login}</button>
{/if}
<slot />


<!-- <script lang="ts">
  import { onMount } from 'svelte';
  import { authStore, isUserAuthStore } from '$lib/auth'; 
  import { i18n } from '$lib/stores/i18n.store';
  import type { Languages } from '$lib/types/languages';

  onMount(async () => {
    await Promise.all([
      authStore.sync(),
      i18n.init()
    ]);
  });

  const handleLogin = () => {
    authStore.signIn();
  };

  const handleLogout = () => {
    authStore.signOut();
  };

  const switchLang = (lang: Languages) => {
    i18n.switchLang(lang);
  };
</script>

<div>
  <button on:click={() => switchLang('en')}>English</button>
  <button on:click={() => switchLang('fr')}>Français</button>
</div>

{#if $isUserAuthStore}
  <button on:click={handleLogout}>{$i18n.core.logout}</button> 
{:else}
  <button on:click={handleLogin}>{$i18n.core.login}</button>
{/if}
<slot /> -->