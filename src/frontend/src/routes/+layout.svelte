<script lang="ts">
  import { onMount } from 'svelte';
  // Assuming authStore exports the functions as methods of an object
  import { authStore, isUserAuthStore } from '$lib/auth'; 
  import { i18n } from '$lib/stores/i18n.store';
  import type { Languages } from '$lib/types/languages';

  onMount(async () => {
    await Promise.all([
      authStore.sync(), // Sync auth state
      i18n.init() // Initialize i18n
    ]);

  });

  // Use the signIn and signOut methods from authStore for event handlers
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
  <!-- Language Switcher -->
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
  import { authSignedInStore, login, logout, sync} from '$lib/auth'; // Adjust import path as necessary

  // Subscribe to the authSignedInStore for reactivity
  import { derived } from 'svelte/store';
  
  const authenticated = derived(authSignedInStore, $authSignedInStore => $authSignedInStore);

  onMount(() => {
    // You might want to check or sync the auth state here if necessary
    sync();
  });

  const handleLogin = () => {
    login(); // Assuming this will update the authSignedInStore on success
  };

  const handleLogout = () => {
    logout(); // Assuming this will update the authSignedInStore on success
  };
</script>

{#if $authenticated}
  <button on:click={handleLogout}>Logout</button> 
{:else}
  <button on:click={handleLogin}>Login with Internet Identity</button>
{/if}
<slot /> -->