<script lang="ts">
	import DayCalendar from '../../../lib/components/calendario/dayCalendar.svelte';
	import Month from "$lib/components/calendario/monthCalendar.svelte";

    let { data } = $props()

	let width: number | undefined = $state()

	let showDayCalendar = $state(false)
	let showMonthCalendar = $state(true)
	let calendarType = $state('Month')

	let filters = ['Compiti', 'Lezioni', 'Assenze']
	let calendarFilter = $state(filters[0])

	function changeCalendar() {
		showMonthCalendar = !showMonthCalendar
		showDayCalendar = !showDayCalendar
	}

	$effect(() => {
		console.log(data)
		calendarType = showDayCalendar ? 'Day' : 'Month'
		// @ts-ignore
		if(width < 720) {
			showDayCalendar = true
		}
	})

	function applyFilters(filter: string) {
		calendarFilter = filter
	}

</script>

<svelte:window bind:innerWidth={width} />

<div id="topCalendar" class="space-between padding2 flexrow valign">
	<div class="showFilter flexrow valign gap-small">
		Filtro:
		<div class="dropdown">
			<button class="dropbtn">{calendarFilter}</button>
			<div class="dropdown-content">
			  {#each filters as f}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<p onclick={() => applyFilters(f)}>{f}</p>
			  {/each}
			</div>
		</div>
	</div>
	<div class="dropdown" style="float:right;">
		Calendario:
		<button class="dropbtn" onclick={() => changeCalendar()}>{calendarType}</button>
	</div>
</div>

{#if showDayCalendar}
	<DayCalendar compiti={data.Agenda} assenze={data.Assenze} lezioni={data.Lezioni} bind:filter={calendarFilter}></DayCalendar>
{:else}
	<Month compiti={data.Agenda} assenze={data.Assenze} lezioni={data.Lezioni} bind:filter={calendarFilter}></Month>
{/if}

<style>

p {
	margin: 0;
}

.dropbtn {
		width: fit-content;
		box-shadow: var(--shadow-color-light) 0px 0px 10px 0px;
		background-color: var(--terthiary-color);
		padding: 0.5rem;
		border: none;
		cursor: pointer;
		outline: 1px solid var(--accent-color-primary);
	}
	
	.dropdown {
	  position: relative;
	  display: inline-block;
	}

	.dropdown:hover .dropbtn {background-color: var(--accent-color-primary)}

	@media screen and (max-width: 720px) {
		#topCalendar {
			display: none;
		}
	}


	/* Dropdown Content (Hidden by Default) */
	.dropdown-content {
		border-radius: var(--border-radius-light);
		display: none;
		position: absolute;
		background-color: var(--terthiary-color);
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
		z-index: 1;
	}

	/* Links inside the dropdown */
	.dropdown-content p {
		cursor: pointer;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}

	.dropdown-content p:hover {background-color: var(--card-color);}
	.dropdown:hover .dropdown-content {display: block;}
</style>