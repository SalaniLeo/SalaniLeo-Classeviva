<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import { capitalizeFirstLetter } from "$lib";
	import { currentTheme, setTheme } from "$lib/theme";
	import { user } from "$lib/user.svelte";
    import { afterNavigate } from "$app/navigation";
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import Loader from "$lib/components/loader.svelte";

    let { data, children } = $props()
    let hiddenSidebar = $state(false);
    let loading = $state(false)
    let pageRoute = $state()
    let pageWidth = $state(0)

    if(data.userInfo?.isLogged) {
        user.setLogged(true)
        user.setInfo({
            firstName: data.userInfo.firstName,
            lastName: data.userInfo.lastName,
            ident: data.userInfo.ident,
            token: data.userInfo.token,
            tokenAP: data.userInfo.tokenAP
        })
    }

    $effect(() => {
        pageRoute = capitalizeFirstLetter($page.url.pathname.split('/').filter(Boolean).pop() || 'home')

        if(pageWidth < 1024) {
            hiddenSidebar = true
        } else if (pageWidth > 1024) {
            hiddenSidebar = false
        }
    })

    function hideSidebar() {
        hiddenSidebar = !hiddenSidebar
    }

    async function logout() {
        const response = await fetch('/auth/logout');

        if (response.ok) {
            user.logout()
            goto('/')
        } else {
            console.error('Logout failed');
        }
    }

    function changeRoute(path: string) {
        loading = true
        goto(`${path}`)

        if (window.matchMedia("(max-width: 720px)").matches) {
            hideSidebar()
        }
    }

    afterNavigate(() => {
        loading = false
    });

</script>

<svelte:window bind:innerWidth={pageWidth}/>

<div class="root">
    <!-- {#if !hiddenSidebar} -->
    <div class="sidebar flexcolumn gap-absurd" class:hiddenSidebar>
        <div class="innerSidebar flexcolumn hstartalign gap-large">
            <div class="sidebarElement flexcolumn gap-moderate hstartalign page">
                {#if user.isLogged}
                    <button class="slot" onclick={() => changeRoute('/user')}>
                        <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7 2C5.34315 2 4 3.34315 4 5V6H3C2.44772 6 2 6.44772 2 7C2 7.55228 2.44772 8 3 8H4V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H4V16H3C2.44772 16 2 16.4477 2 17C2 17.5523 2.44772 18 3 18H4V19C4 20.6569 5.34315 22 7 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2H7ZM9 12C9 9.79086 10.7909 8 13 8C15.2091 8 17 9.79086 17 12C17 14.2091 15.2091 16 13 16C10.7909 16 9 14.2091 9 12ZM10.3373 19.6816C10.7235 19.2671 11.415 19 12.9909 19C14.606 19 15.2909 19.2611 15.6701 19.6753C16.0431 20.0826 16.6757 20.1105 17.083 19.7375C17.4903 19.3646 17.5182 18.732 17.1452 18.3247C16.1519 17.2398 14.683 17 12.9909 17C11.3097 17 9.8629 17.2568 8.87391 18.3184C8.49745 18.7225 8.51985 19.3552 8.92395 19.7317C9.32804 20.1081 9.96081 20.0857 10.3373 19.6816Z" fill="var(--font-primary-color)"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13 10C11.8954 10 11 10.8954 11 12C11 13.1046 11.8954 14 13 14C14.1046 14 15 13.1046 15 12C15 10.8954 14.1046 10 13 10Z" fill="var(--font-primary-color)"></path> </g></svg>
                        <span class="hide">User</span></button>
                    <button class="slot" onclick={() => logout()}>
                        <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 9.56757V14.4324C3.5 16.7258 3.5 17.8724 4.22161 18.5849C4.87719 19.2321 5.89578 19.2913 7.81846 19.2968C7.71686 18.6224 7.69563 17.8168 7.69029 16.8689C7.68802 16.4659 8.01709 16.1374 8.42529 16.1351C8.83348 16.1329 9.16624 16.4578 9.16851 16.8608C9.17451 17.9247 9.20249 18.6789 9.30898 19.2512C9.41158 19.8027 9.57634 20.1219 9.81626 20.3588C10.089 20.6281 10.4719 20.8037 11.1951 20.8996C11.9395 20.9985 12.9261 21 14.3407 21H15.3262C16.7407 21 17.7273 20.9985 18.4717 20.8996C19.1949 20.8037 19.5778 20.6281 19.8505 20.3588C20.1233 20.0895 20.3011 19.7114 20.3983 18.9975C20.4984 18.2626 20.5 17.2885 20.5 15.8919V8.10811C20.5 6.71149 20.4984 5.73743 20.3983 5.0025C20.3011 4.28855 20.1233 3.91048 19.8505 3.6412C19.5778 3.37192 19.1949 3.19635 18.4717 3.10036C17.7273 3.00155 16.7407 3 15.3262 3H14.3407C12.9261 3 11.9395 3.00155 11.1951 3.10036C10.4719 3.19635 10.089 3.37192 9.81626 3.6412C9.57634 3.87807 9.41158 4.19728 9.30898 4.74877C9.20249 5.32112 9.17451 6.07525 9.16851 7.1392C9.16624 7.54221 8.83348 7.8671 8.42529 7.86485C8.01709 7.86261 7.68802 7.53409 7.69029 7.13107C7.69563 6.18322 7.71686 5.37758 7.81846 4.70325C5.89578 4.70867 4.87719 4.76789 4.22161 5.41515C3.5 6.12759 3.5 7.27425 3.5 9.56757ZM5.93385 12.516C5.6452 12.231 5.6452 11.769 5.93385 11.484L7.90484 9.53806C8.19348 9.25308 8.66147 9.25308 8.95011 9.53806C9.23876 9.82304 9.23876 10.2851 8.95011 10.5701L8.24088 11.2703L15.3259 11.2703C15.7341 11.2703 16.0651 11.597 16.0651 12C16.0651 12.403 15.7341 12.7297 15.3259 12.7297L8.24088 12.7297L8.95011 13.4299C9.23876 13.7149 9.23876 14.177 8.95011 14.4619C8.66147 14.7469 8.19348 14.7469 7.90484 14.4619L5.93385 12.516Z" fill="var(--font-primary-color)"></path> </g></svg>
                        <span class="hide">Logout</span></button>
                {:else}
                    <button class="slot" onclick={() => changeRoute('/')}>
                        <svg class="navIcon" fill="#000000" viewBox="0 0 24 24" id="home-alt-1" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0,1.42,1.42l.29-.3V20.3A1.77,1.77,0,0,0,5.83,22H8.5a1,1,0,0,0,1-1V16.1a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1V21a1,1,0,0,0,1,1h2.67A1.77,1.77,0,0,0,20,20.3V12.41l.29.3a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,11.29Z" style="fill: var(--font-primary-color);"></path></g></svg>
                        <span class="hide">Home</span></button>
                    <button class="slot" onclick={() => changeRoute('/auth/login')}>
                        <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 9.56757V14.4324C3.5 16.7258 3.5 17.8724 4.22162 18.5849C4.87718 19.2321 5.89572 19.2913 7.81827 19.2968C7.81303 19.262 7.80803 19.2271 7.80324 19.192C7.68837 18.3484 7.68839 17.2759 7.68841 15.9453L7.68841 15.8919C7.68841 15.4889 8.01933 15.1622 8.42754 15.1622C8.83575 15.1622 9.16667 15.4889 9.16667 15.8919C9.16667 17.2885 9.16824 18.2626 9.26832 18.9975C9.36554 19.7114 9.54337 20.0895 9.81613 20.3588C10.0889 20.6281 10.4718 20.8037 11.195 20.8996C11.9394 20.9985 12.926 21 14.3406 21H15.3261C16.7407 21 17.7273 20.9985 18.4717 20.8996C19.1948 20.8037 19.5778 20.6281 19.8505 20.3588C20.1233 20.0895 20.3011 19.7114 20.3983 18.9975C20.4984 18.2626 20.5 17.2885 20.5 15.8919V8.10811C20.5 6.71149 20.4984 5.73743 20.3983 5.0025C20.3011 4.28855 20.1233 3.91048 19.8505 3.6412C19.5778 3.37192 19.1948 3.19635 18.4717 3.10036C17.7273 3.00155 16.7407 3 15.3261 3H14.3406C12.926 3 11.9394 3.00155 11.195 3.10036C10.4718 3.19635 10.0889 3.37192 9.81613 3.6412C9.54337 3.91048 9.36554 4.28855 9.26832 5.0025C9.16824 5.73743 9.16667 6.71149 9.16667 8.10811C9.16667 8.51113 8.83575 8.83784 8.42754 8.83784C8.01933 8.83784 7.68841 8.51113 7.68841 8.10811L7.68841 8.05472C7.68839 6.72409 7.68837 5.65156 7.80324 4.80803C7.80803 4.77288 7.81303 4.73795 7.81827 4.70325C5.89572 4.70867 4.87718 4.76792 4.22162 5.41515C3.5 6.12759 3.5 7.27425 3.5 9.56757ZM13.385 14.9484L15.8487 12.516C16.1374 12.231 16.1374 11.769 15.8487 11.484L13.385 9.05157C13.0963 8.76659 12.6283 8.76659 12.3397 9.05157C12.051 9.33655 12.051 9.79859 12.3397 10.0836L13.5417 11.2703H6.45652C6.04831 11.2703 5.71739 11.597 5.71739 12C5.71739 12.403 6.04831 12.7297 6.45652 12.7297H13.5417L12.3397 13.9164C12.051 14.2014 12.051 14.6635 12.3397 14.9484C12.6283 15.2334 13.0963 15.2334 13.385 14.9484Z" fill="var(--font-primary-color)"></path> </g></svg>
                        <!-- <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z" fill="var(--font-primary-color)"></path> <path d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z" fill="var(--font-primary-color)"></path> </g></svg> -->
                        <span class="hide">Login</span></button>
                {/if}
            </div>
            {#if user.isLogged}
                <div class="sidebarElement flexcolumn gap-moderate hstartalign page">
                    <button class="slot valign" onclick={() => changeRoute('/registro/voti')}>
                        <svg class="navIcon" fill="var(--font-primary-color)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 297 297" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M261.489,66.973L197.412,2.895C195.558,1.041,193.044,0,190.423,0H42.499c-5.458,0-9.884,4.426-9.884,9.883v277.233 c0,5.458,4.426,9.884,9.884,9.884h212.002c5.458,0,9.884-4.426,9.884-9.884V73.961C264.385,71.34,263.343,68.826,261.489,66.973z M200.307,33.745l30.333,30.333h-30.333V33.745z M52.383,277.232V19.767h128.156v54.194c0,5.459,4.426,9.884,9.884,9.884h54.194 v193.388H52.383z"></path> <path d="M149.523,136.676c-1.501-3.753-5.136-6.213-9.178-6.213c-4.041,0-7.676,2.46-9.177,6.213l-32.615,81.539 c-2.027,5.068,0.438,10.819,5.506,12.848c5.066,2.025,10.819-0.439,12.848-5.507l4.037-10.095h38.803l4.037,10.095 c1.547,3.864,5.258,6.216,9.181,6.216c1.222,0,2.464-0.229,3.667-0.709c5.068-2.028,7.534-7.779,5.507-12.848L149.523,136.676z M128.852,195.693l11.494-28.735l11.495,28.735H128.852z"></path> <path d="M211.553,133.428h-7.952v-8.002c0-5.458-4.426-9.883-9.884-9.883c-5.458,0-9.883,4.425-9.883,9.883v8.002h-7.952 c-5.459,0-9.884,4.425-9.884,9.883c0,5.459,4.425,9.884,9.884,9.884h7.952v8.002c0,5.458,4.425,9.884,9.883,9.884 c5.458,0,9.884-4.426,9.884-9.884v-8.002h7.952c5.458,0,9.884-4.425,9.884-9.884C221.436,137.852,217.011,133.428,211.553,133.428z "></path> </g> </g></svg>
                        <span class="hide">Voti</span></button>
                    <button class="slot valign" onclick={() => changeRoute('/registro/calendario')}>
                        <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5V4.07926C4.81067 4.19451 3.86577 4.47737 3.17157 5.17157C2.47737 5.86577 2.19451 6.81067 2.07926 8.25H21.9207C21.8055 6.81067 21.5226 5.86577 20.8284 5.17157C20.1342 4.47737 19.1893 4.19451 17.75 4.07926V2.5C17.75 2.08579 17.4142 1.75 17 1.75C16.5858 1.75 16.25 2.08579 16.25 2.5V4.0129C15.5847 4 14.839 4 14 4H10C9.16097 4 8.41527 4 7.75 4.0129V2.5Z" fill="var(--font-primary-color)"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 11.161 2 10.4153 2.0129 9.75H21.9871C22 10.4153 22 11.161 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12ZM17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14ZM17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18ZM13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17ZM7 14C7.55228 14 8 13.5523 8 13C8 12.4477 7.55228 12 7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14ZM7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="var(--font-primary-color)"></path> </g></svg>
                        <!-- <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.28906 6.29C7.86906 6.29 7.53906 5.95 7.53906 5.54V2.75C7.53906 2.34 7.86906 2 8.28906 2C8.70906 2 9.03906 2.34 9.03906 2.75V5.53C9.03906 5.95 8.70906 6.29 8.28906 6.29Z" fill="var(--font-primary-color)"></path> <path d="M15.7109 6.29C15.2909 6.29 14.9609 5.95 14.9609 5.54V2.75C14.9609 2.33 15.3009 2 15.7109 2C16.1309 2 16.4609 2.34 16.4609 2.75V5.53C16.4609 5.95 16.1309 6.29 15.7109 6.29Z" fill="var(--font-primary-color)"></path> <path d="M19.57 4.5C18.91 4.01 17.96 4.48 17.96 5.31V5.41C17.96 6.58 17.12 7.66 15.95 7.78C14.6 7.92 13.46 6.86 13.46 5.54V4.5C13.46 3.95 13.01 3.5 12.46 3.5H11.54C10.99 3.5 10.54 3.95 10.54 4.5V5.54C10.54 6.33 10.13 7.03 9.51 7.42C9.42 7.48 9.32 7.53 9.22 7.58C9.13 7.63 9.03 7.67 8.92 7.7C8.8 7.74 8.67 7.77 8.53 7.78C8.37 7.8 8.21 7.8 8.05 7.78C7.91 7.77 7.78 7.74 7.66 7.7C7.56 7.67 7.46 7.63 7.36 7.58C7.26 7.53 7.16 7.48 7.07 7.42C6.44 6.98 6.04 6.22 6.04 5.41V5.31C6.04 4.54 5.22 4.08 4.57 4.41C4.56 4.42 4.55 4.42 4.54 4.43C4.5 4.45 4.47 4.47 4.43 4.5C4.4 4.53 4.36 4.55 4.33 4.58C4.05 4.8 3.8 5.05 3.59 5.32C3.48 5.44 3.39 5.57 3.31 5.7C3.3 5.71 3.29 5.72 3.28 5.74C3.19 5.87 3.11 6.02 3.04 6.16C3.02 6.18 3.01 6.19 3.01 6.21C2.95 6.33 2.89 6.45 2.85 6.58C2.82 6.63 2.81 6.67 2.79 6.72C2.73 6.87 2.69 7.02 2.65 7.17C2.61 7.31 2.58 7.46 2.56 7.61C2.54 7.72 2.53 7.83 2.52 7.95C2.51 8.09 2.5 8.23 2.5 8.37V17.13C2.5 19.82 4.68 22 7.37 22H16.63C19.32 22 21.5 19.82 21.5 17.13V8.37C21.5 6.78 20.74 5.39 19.57 4.5ZM12 17.42H7.36C6.95 17.42 6.61 17.08 6.61 16.67C6.61 16.25 6.95 15.91 7.36 15.91H12C12.42 15.91 12.75 16.25 12.75 16.67C12.75 17.08 12.42 17.42 12 17.42ZM14.78 13.71H7.36C6.95 13.71 6.61 13.37 6.61 12.96C6.61 12.54 6.95 12.2 7.36 12.2H14.78C15.2 12.2 15.54 12.54 15.54 12.96C15.54 13.37 15.2 13.71 14.78 13.71Z" fill="var(--font-primary-color)"></path> </g></svg> -->
                        <span class="hide">Calendario</span>
                    </button>
                    <button class="slot valign halign" onclick={() => changeRoute('/registro/bacheca')}>
                        <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 2.0127V22L15 22C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2H9L8.75 2.0127ZM10.75 6.5C10.75 6.08579 11.0858 5.75 11.5 5.75H16.5C16.9142 5.75 17.25 6.08579 17.25 6.5C17.25 6.91421 16.9142 7.25 16.5 7.25H11.5C11.0858 7.25 10.75 6.91421 10.75 6.5ZM10.75 10C10.75 9.58579 11.0858 9.25 11.5 9.25H16.5C16.9142 9.25 17.25 9.58579 17.25 10C17.25 10.4142 16.9142 10.75 16.5 10.75H11.5C11.0858 10.75 10.75 10.4142 10.75 10ZM3.0007 7.25C3.00753 4.91427 3.08136 3.676 3.87868 2.87868C4.55366 2.2037 5.54467 2.04722 7.25 2.01095V21.9891C5.54467 21.9528 4.55366 21.7963 3.87868 21.1213C3.08136 20.324 3.00753 19.0857 3.0007 16.75H4C4.41421 16.75 4.75 16.4142 4.75 16C4.75 15.5858 4.41421 15.25 4 15.25H3V12.75H4C4.41421 12.75 4.75 12.4142 4.75 12C4.75 11.5858 4.41421 11.25 4 11.25H3V8.75H4C4.41421 8.75 4.75 8.41421 4.75 8C4.75 7.58579 4.41421 7.25 4 7.25H3.0007ZM3.0007 7.25H2C1.58579 7.25 1.25 7.58579 1.25 8C1.25 8.41421 1.58579 8.75 2 8.75H3V8C3 7.73811 3 7.48834 3.0007 7.25ZM3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3V12.75ZM3 15.25H2C1.58579 15.25 1.25 15.5858 1.25 16C1.25 16.4142 1.58579 16.75 2 16.75H3.0007C3 16.5117 3 16.2619 3 16V15.25Z" fill="var(--font-primary-color)"></path> </g></svg>
                        <span class="hide">Bacheca</span>
                    </button>
                    <button class="slot valign halign" onclick={() => changeRoute('/registro/note')}>
                        <svg class="navIcon" fill="var(--font-primary-color)" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M236.74414,187.96585l-87.96875-152a24.012,24.012,0,0,0-41.54687,0v.00782L19.25977,187.96585a23.9982,23.9982,0,0,0,20.76562,36.02344H215.97852a23.9982,23.9982,0,0,0,20.76562-36.02344Zm-116.75-83.96875a8,8,0,1,1,16,0v40a8,8,0,1,1-16,0ZM128,192a12,12,0,1,1,12-12A12.00059,12.00059,0,0,1,128,192Z"></path> </g></svg>
                        <span class="hide">Note</span>
                    </button>
                    <button class="slot valign halign" onclick={() => changeRoute('/registro/didattica')}>
                        <svg class="navIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.75 5.75H16.2021C16.5773 5.75 16.9258 5.75 17.25 5.75223V10.6189L16.5448 10.2248L16.5361 10.22C16.5017 10.2007 16.4388 10.1654 16.3765 10.138C16.2946 10.1019 16.1649 10.056 16 10.056C15.8351 10.056 15.7054 10.1019 15.6235 10.138C15.5612 10.1654 15.4983 10.2007 15.4639 10.22L15.4552 10.2248L14.75 10.6189V5.75Z" fill="var(--font-primary-color)"></path> <path d="M22 11.5479V13.75C22 17.5212 22 19.4069 20.8284 20.5784C19.6569 21.75 17.7712 21.75 14 21.75H10C6.22876 21.75 4.34315 21.75 3.17157 20.5784C2 19.4069 2 17.5212 2 13.75V6.69975C2 5.81722 2 5.37595 2.06935 5.00839C2.37464 3.39031 3.64031 2.12464 5.25839 1.81935C5.62595 1.75 6.06722 1.75 6.94975 1.75C7.33642 1.75 7.52976 1.75 7.71557 1.76738C8.51665 1.84229 9.27652 2.15704 9.89594 2.67051C10.0396 2.78961 10.1763 2.92633 10.4497 3.19975L11 3.75C11.8158 4.56578 12.2237 4.97367 12.7121 5.24543C12.8851 5.34169 13.0649 5.4249 13.25 5.49443V5.75V11.1739L13.25 11.2029C13.2499 11.338 13.2498 11.5053 13.2684 11.6456C13.2878 11.7914 13.3512 12.1235 13.6686 12.3428C14.0156 12.5825 14.371 12.4922 14.5327 12.433C14.6682 12.3835 14.8147 12.3014 14.9195 12.2426L14.9448 12.2284L16 11.6387L17.0552 12.2284L17.0805 12.2426C17.1853 12.3014 17.3318 12.3835 17.4673 12.433C17.629 12.4922 17.9844 12.5825 18.3314 12.3428C18.6488 12.1235 18.7122 11.7914 18.7316 11.6456C18.7502 11.5053 18.7501 11.338 18.75 11.2029L18.75 11.1739V5.79686C19.7988 5.86911 20.4872 6.05274 21.0062 6.51946C21.0849 6.59024 21.1598 6.66514 21.2305 6.74383C22 7.59935 22 8.91554 22 11.5479Z" fill="var(--font-primary-color)"></path> </g></svg>
                        <span class="hide">Didattica</span>
                    </button>
                </div>
            {/if}
        </div>
        <!-- <div class="bottom"> -->
            <!-- <p style="text-align: center !important;">Made be salaniLeo</p> -->
        <!-- </div> -->
    </div>
    <!-- {/if} -->

    <div class="content flexcolumn gap">
        <div class="flexcolumn gap-medium">
            <div class="flexrow space-between valign" id="topBar">
                <!-- svelte-ignore a11y_missing_content -->
                <div class="flexrow gap-moderate valign">
                    <div id="hidesidebar" class="flexrow gap-moderate">
                        {#if hiddenSidebar}
                            <!-- svelte-ignore a11y_consider_explicit_label -->
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button 
                            onclick={hideSidebar} 
                            class="transparent flexrow gap-medium hider" style="font-size: 1.5rem;">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.81 2C6.32 2 5.08 2.36 4.13 3.05C3.71 3.34 3.34 3.71 3.05 4.13C2.36 5.08 2 6.32 2 7.81V16.19C2 19.83 4.17 22 7.81 22H15.28V2H7.81ZM12.12 12.53L9.56 15.09C9.41 15.24 9.22 15.31 9.03 15.31C8.84 15.31 8.65 15.24 8.5 15.09C8.21 14.8 8.21 14.32 8.5 14.03L10.52 12L8.5 9.97C8.2 9.68 8.2 9.2 8.5 8.91C8.8 8.62 9.27 8.62 9.56 8.91L12.12 11.47C12.41 11.76 12.41 12.24 12.12 12.53Z" fill="var(--font-primary-color)"></path> <path d="M16.7793 2.03125V21.9812C18.0093 21.9012 19.0493 21.5513 19.8693 20.9513C20.2893 20.6612 20.6593 20.2913 20.9493 19.8713C21.6393 18.9212 21.9993 17.6813 21.9993 16.1913V7.81125C21.9993 4.37125 20.0593 2.24125 16.7793 2.03125Z" fill="var(--font-primary-color)"></path> </g></svg>
                        </button>
                        {:else}
                            <!-- svelte-ignore a11y_consider_explicit_label -->
                            <!-- svelte-ignore event_directive_deprecated -->
                            <button 
                            onclick={hideSidebar} 
                            class="transparent flexrow gap-medium hider" style="font-size: 1.5rem;">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 7.81125V16.1913C2 17.6813 2.36 18.9212 3.05 19.8713C3.34 20.2913 3.71 20.6612 4.13 20.9513C4.95 21.5513 5.99 21.9012 7.22 21.9812V2.03125C3.94 2.24125 2 4.37125 2 7.81125Z" fill="var(--font-primary-color)"></path> <path d="M20.9507 4.13C20.6607 3.71 20.2907 3.34 19.8707 3.05C18.9207 2.36 17.6807 2 16.1907 2H8.7207V22H16.1907C19.8307 22 22.0007 19.83 22.0007 16.19V7.81C22.0007 6.32 21.6407 5.08 20.9507 4.13ZM15.5007 14.03C15.7907 14.32 15.7907 14.8 15.5007 15.09C15.3507 15.24 15.1607 15.31 14.9707 15.31C14.7807 15.31 14.5907 15.24 14.4407 15.09L11.8807 12.53C11.5907 12.24 11.5907 11.76 11.8807 11.47L14.4407 8.91C14.7307 8.62 15.2107 8.62 15.5007 8.91C15.7907 9.2 15.7907 9.68 15.5007 9.97L13.4807 12L15.5007 14.03Z" fill="var(--font-primary-color)"></path> </g></svg>
                        </button>
                            {/if}
                    </div>
                    <div class="flexrow gap-moderate valign">
                        <h2>{pageRoute}</h2>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <!-- svelte-ignore event_directive_deprecated -->
                        <button class="transparent " id="reloader">
                        <h2><i class="fa-solid fa-rotate-right"></i></h2></button>
                    </div>
                </div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div id="theme-select">
                    {#if $currentTheme == 'dark'}
                        <i class="fa-solid fa-sun themer" onclick={setTheme}></i>
                    {:else}
                        <i class="fa-solid fa-moon themer" onclick={setTheme}></i>
                    {/if}
                </div>
            </div>
        </div>
        {#if loading}
            <Loader></Loader>
        {:else}
            {@render children()}
        {/if}
    </div>
</div>

<style>
    .hider {
        font-size: 2rem !important;
        width: 2rem;
    }
    .navIcon {
        height: 1.25rem;
        width: 1.5rem;
    }
    h2 {
        margin: 0;
    }
    #topBar {
        padding: 0.5rem;
    }
    .hiddenSidebar {
        transition-duration: 0s !important;
    }
    .hiddenSidebar .hide {
        display: none;
        visibility: hidden;
    }
    .hide {
        text-align: start;
        min-width: 6rem;
    }
    .slot {
        height: 35px;
        display: flex;
        justify-content: start;
        background-color: transparent;
        outline: none;
        min-width: max-content;
        gap: 0.5rem;
    }
    .slot:hover {
        background-color: var(--accent-color-secondary);
        box-shadow: rgba(0, 0, 0, 0.205) 0px 0px 10px 0px;
    }
    .page {
        display: flex;
        justify-content: start;
        gap: 0.5rem;
        box-shadow: var(--shadow-color-light) 0px 0px 15px 2px;
        border-radius: var(--border-radius-heavy);
        padding: 1rem;
        background-color: var(--terthiary-color);
    }
    .root {
        height: 100vh;
        background-color: var(--primary-color);
        display: flex;
    }

    .root > .sidebar {
        min-width: max-content !important;
        margin: 1rem;
        margin-right: 0 !important;
        justify-content: center;
        /* transition-duration: 0s !important; */
    }

    .root > .content {
        box-shadow: var(--shadow-color-medium) 0px 0px 15px 2px;
        flex-grow: 2;
        margin: 1rem;
        min-width: 0;
        width: unset;
        padding: 1rem;
        border-radius: var(--border-radius-heavy);
        background-color: var(--secondary-color);
    }

    .sidebarElement {
        height: fit-content !important;
    }

    @media screen and (max-width: 720px) {
        .sidebar * {
            box-shadow: unset !important;
        }
        .sidebar {
            position: fixed;
            left: 0;
            z-index: 2;
            margin: 0 !important;
            width: 100%;
            height: 100%;
            background-color: var(--background-blurry);
            backdrop-filter: blur(var(--background-blur-normal));
        }
        .hiddenSidebar {
            /* background-color: transparent; */
            transform: translateX(-100%);
        }
        .sidebarElement {
            background-color: unset;
            border-radius: unset !important;
        }
        .root {
            flex-direction: column !important;
        }
    }

    @media screen and (max-width: 480px) {
        .content {
            min-width: 0;
            margin: 0 !important;
            border-radius: 0 !important;
            width: unset;
            padding: 0 !important;
        }
        #topBar {
            border-bottom: 2px solid black !important;
            padding: 1rem;
        }
    }
</style>