<script lang="ts">
    import { onMount } from 'svelte';
    import * as auth from '$lib/auth';
  
    let authenticated = false;

    onMount(async () => {
      authenticated = await auth.isAuthenticated();
    });
  
    const handleLogin = () => {
      auth.login();
    };
  
    const handleLogout = () => {
      auth.logout();
    };
</script>
  
  {#if authenticated}
    <button on:click={handleLogout}>Logout</button> 
  {:else}
    <button on:click={handleLogin}>Login with Internet Identity</button>
  {/if}
  <slot />
  
<!-- <style lang="scss" global>
	@import '../lib/styles/global.scss';
</style> -->