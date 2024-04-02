<script lang="ts">
  import { onMount } from 'svelte';
  // Assuming authStore exports the functions as methods of an object
  import { authStore, authSignedInStore } from '$lib/auth'; 

  onMount(() => {
    // Use the sync method from authStore
    authStore.sync();
  });

  // Use the signIn and signOut methods from authStore for event handlers
  const handleLogin = () => {
    authStore.signIn();
  };

  const handleLogout = () => {
    authStore.signOut();
  };
</script>

{#if $authSignedInStore}
  <button on:click={handleLogout}>Logout</button> 
{:else}
  <button on:click={handleLogin}>Login with Internet Identity</button>
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