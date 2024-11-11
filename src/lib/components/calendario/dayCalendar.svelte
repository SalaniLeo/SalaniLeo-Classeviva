<script lang="ts">
	import { capitalizeNames } from "$lib";

    const { compiti, assenze, lezioni, filter = $bindable() } = $props()

    const date = new Date()
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const today = {
        dayNumber: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    }

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthIndex = $state(today.month)
    let dayIndex = $state(date.getDate())
    let dayArrNumber = $state(date.getDay())
    let dayName = $derived(dayNames[dayArrNumber])
    
    let month = $derived(monthNames[monthIndex])
    let year = $state(date.getFullYear())

    let numberOfDays = $derived(new Date(year, monthIndex+1, 0).getDate())

    function gotoNextDay() {
        dayArrNumber += 1
        dayIndex += 1
        if(dayIndex >= numberOfDays) {
            monthIndex += 1;
            dayIndex = 1
        }
        if(dayArrNumber >= 7) {
            dayArrNumber = 0
        }
        if(monthIndex >= 11) {
            year += 1;
            monthIndex = 0
        }
    }

    function gotoPrevDay() {
        dayArrNumber -= 1
        dayIndex -= 1
        if(dayIndex <= 0) {
            monthIndex -= 1;
            dayIndex = numberOfDays
        }
        if(dayArrNumber < 0) {
            dayArrNumber = 6
        }
        if(monthIndex <= 0) {
            year -= 1;
            monthIndex = 11
        }
    }

    function hasDayAnyAbsences(year: number, month: number, dayNum: number) {
        dayNum = dayNum < 10 ? `0${dayNum}` : String(dayNum);
        month = month < 10 ? `0${month}` : String(month);

        let day = `${year}-${month}-${dayNum}`;
        let events = Object.values(assenze).filter(e => e.evtDate.startsWith(day));

        return events
    }

    function hasDayAnyWork(year: number, month: number, dayNum: string | number) {
        dayNum = dayNum < 10 ? `0${dayNum}` : String(dayNum);
        month = month < 10 ? `0${month}` : String(month);

        let day = `${year}-${month}-${dayNum}`;
        let events = Object.values(compiti).filter(e => e.evtDatetimeBegin.startsWith(day));

        if (events.length === 0) {
            return [{
                numeroCompiti: 0
            }];
        } else {
            let arrangedWork: {
                nome: any; numeroCompiti: number;
                showCompiti: boolean; compiti: unknown[];
            }[] = [];

            events.forEach((e) => {
            let authorEntry = arrangedWork.find((entry) => entry.nome === e.authorName);

            if (authorEntry) {
                authorEntry.compiti.push(e);
                authorEntry.numeroCompiti = authorEntry.compiti.length;
            } else {
                arrangedWork.push({
                    nome: e.authorName,
                    numeroCompiti: 1,
                    showCompiti: false,
                    compiti: [e]
                });
            }
            });

            let dayWork = $state(arrangedWork)

            return dayWork;
        }
    }

    function hasDayAnyLessons(year: number, month: number, dayNum: string | number): any[] {
        const dayStr = Number(dayNum) < 10 ? `0${dayNum}` : String(dayNum);
        const monthStr = month < 10 ? `0${month}` : String(month);
        const day = `${year}-${monthStr}-${dayStr}`;
        const specifiedDate = new Date(`${day}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return specifiedDate <= today ? lezioni.filter((e: any) => e.evtDate === day) : [];
    }

    // function checkAbsence(day: number) {
    //     if (dayNames[day % 7] != 'Sun') {
    //         if (monthIndex == today.month && day - getFirstDayIndex + 1 >= today.dayNumber) {
    //             return false
    //         }
    //         return true
    //     } else {
    //         return false
    //     }
    // }
</script>

<div id="calendar" class="flexcolumn page">
    <div id="actions" class="topFixed flexrow halign valign padding4">
        <div id="backArrow">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore event_directive_deprecated -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <i class="fa-solid fa-chevron-left" onclick={() => gotoPrevDay()}></i>
        </div>
        <div class="flexcolumn gap-medium">
            <div id="month" class="flexrow fit-content" style="width: 300px;">
                {dayName} {dayIndex}, {month}
            </div>
            <div id="year">
                {year}
            </div>
        </div>
        <div id="forwardArrow">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore event_directive_deprecated -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <i class="fa-solid fa-chevron-right" onclick={() => gotoNextDay()}></i>
        </div>
    </div>
    <div class="flexcolumn innerScroll">
        <div class="compiti flexcolumn gap-small">
            {#if filter === 'Compiti'}
                {#each hasDayAnyWork(year, monthIndex+1, String(dayIndex)) as dayWork: $state([])}
                    {#if dayWork.numeroCompiti > 0}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <!-- svelte-ignore event_directive_deprecated -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <div class="calendarRow" 
                            class:showCompiti={dayWork.showCompiti}
                            onclick={() => dayWork.showCompiti = true}
                            >
                            <div class="flexcolumn">
                                <div class="flexrow space-between hstartalign">
                                    <b class="author padding1">{capitalizeNames(dayWork.nome)}</b>
                                </div>
                                {#each dayWork.compiti as compito}
                                    <div class="hstartalign">
                                        <p>{compito.notes}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {:else}
                        <div class="calendarRow">
                            <p>Nessun compito per oggi</p>
                        </div>
                    {/if}
                {/each}
            {:else if filter === 'Lezioni'}
                {#each hasDayAnyLessons(year, monthIndex+1, String(dayIndex)) as dayLesson, i}
                    <div class="calendarRow"
                    style="animation: show 1s {(i)*25}ms forwards; opacity: 0"
                    >
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                        <p>{capitalizeNames(dayLesson.authorName)} <span><small>{capitalizeNames(dayLesson.subjectDesc)}</small></span></p>
                        <p>{dayLesson.lessonArg}</p>
                    </div>
                {/each}
            {:else if filter === 'Assenze'}
                {#each Object(hasDayAnyAbsences(year, monthIndex+1, dayIndex)) as dayAbsence: $state([])}
                <!-- {#if checkAbsence(dayIndex)} -->
                        <p class="calendarRow flexrow gap-small" class:error={!dayAbsence.isJustified} class:ok={dayAbsence.isJustified} style="animation: show 1s {(i * 7 + y)*10}ms forwards;"
                        ><span>{dayAbsence.info}</span><i class="fa-solid fa-calendar-xmark"></i></p>
                    <!-- {/if} -->
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .innerScroll {
        height: 100%;
        overflow: scroll;
    }
    .calendarRow:hover {
        background-color: var(--accent-color-secondary);
        box-shadow: var(--shadow-color-light) 0px 0px 10px 0px !important;
    }
    .calendarRow * {
        justify-content: start;
        align-items: start;
        text-align: left;
    }
    .calendarRow {
        cursor: pointer;
        user-select: none;
        width: auto;
        box-shadow: var(--shadow-color-light) 0px 0px 2px 0px;
        background-color: var(--accent-color-primary);
        /* max-height: 1rem; */
        line-height: 1rem;
        padding: 0.5rem;
        border-radius: var(--border-radius-light);
        overflow: hidden;
        min-height: max-content;
        z-index: 0 !important;
    }
    .compiti {
        padding: 1rem;
    }
    .flexrow {
        display: flex;
        flex: 1;
        justify-content: space-around;
    }
    .fa-chevron-left, .fa-chevron-right {
        cursor: pointer;
    }
    #month {
        font-size: 1.5rem;
        width: 6rem;
        text-align: center;
    }
    #year {
        text-align: center;
    }
    .flexrow {
        flex-wrap: nowrap !important;
    }
    @media screen and (max-width: 480px) {
        #month {
            font-size: 1.25rem !important;
            width: 240px !important;
            text-align: center;
        }
    }
</style>
