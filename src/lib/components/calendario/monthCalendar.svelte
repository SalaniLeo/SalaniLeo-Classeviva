<script lang="ts">
    import Dialog from '../dialoghi/workDialog.svelte';
    import { capitalizeNames } from "$lib";
    import LessonsDialog from '../dialoghi/lessonsDialog.svelte';

    // Destructure and assign props for component
    const { compiti, assenze, lezioni, filter = $bindable() } = $props();

    // Set today's date with hours zeroed out for consistent comparisons
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const today = {
        dayNumber: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    };

    // Format date for use in comparison strings
    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

    // Initialize day and month names for display
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthIndex = $state(date.getMonth());
    let lessons = $state([]);

    // Initialize lessons state with showModal flag set to false
    lezioni.forEach((lesson: { showModal: boolean; }) => {
        lesson.showModal = false;
        lessons.push(lesson);
    });

    // Reactive states for month and year, to update based on monthIndex
    let month = $derived(monthNames[monthIndex]);
    let year = $state(date.getFullYear());

    // Get the first day index and total number of days for the current month
    let getFirstDayIndex = $derived(new Date(year, monthIndex, 1).getDay());
    let numberOfDays = $derived(new Date(year, monthIndex + 1, 0).getDate());

    // Calculate calendar row display based on month and day start index
    let calendarRows = $derived(
        getFirstDayIndex <= 5 && numberOfDays <= 30 || getFirstDayIndex <= 4 || month === "February" ? 5 : 6
    );

    // Navigate to the next month, updating year if necessary
    function gotoNextMonth() {
        if (monthIndex >= 11) {
            year += 1;
            monthIndex = 0;
        } else {
            monthIndex += 1;
        }
    }

    // Navigate to the previous month, updating year if necessary
    function gotoPrevMonth() {
        if (monthIndex <= 0) {
            year -= 1;
            monthIndex = 11;
        } else {
            monthIndex -= 1;
        }
    }

    // Checks if a specific day has any lessons
    function hasDayAnyLessons(year: number, month: number, dayNum: string | number): any[] {
        const dayStr = Number(dayNum) < 10 ? `0${dayNum}` : String(dayNum);
        const monthStr = month < 10 ? `0${month}` : String(month);
        const day = `${year}-${monthStr}-${dayStr}`;
        const specifiedDate = new Date(`${day}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return specifiedDate <= today ? lessons.filter((e: any) => e.evtDate === day) : [];
    }

    // Checks if a specific day has any absences
    function hasDayAnyAbsences(year: number, month: number, dayNum: string | number) {
        const dayStr = Number(dayNum) < 10 ? `0${dayNum}` : String(dayNum);
        const monthStr = month < 10 ? `0${month}` : String(month);
        const day = `${year}-${monthStr}-${dayStr}`;

        let data = Object.values(assenze).filter(e => e.evtDate.startsWith(day))
        if(data.length > 0) {
            data[0].info = 'Assente'
            return data;
        } else {
            return [
                {
                    'isJustified': true,
                    'info': 'Presente'
                }
            ]
        }
    }

    // Checks if a specific day has any assignments/work and organizes by author
    function hasDayAnyWork(year: number, month: number, dayNum: string | number) {
        const dayStr = Number(dayNum) < 10 ? `0${dayNum}` : String(dayNum);
        const monthStr = month < 10 ? `0${month}` : String(month);
        const day = `${year}-${monthStr}-${dayStr}`;

        const events = Object.values(compiti).filter(e => e.evtDatetimeBegin.startsWith(day));
        if (events.length === 0) return [];

        // Group assignments by author and count per author
        const arrangedWork = events.reduce((acc: any[], e) => {
            let authorEntry = acc.find(entry => entry.nome === e.authorName);
            if (authorEntry) {
                authorEntry.compiti.push(e);
                authorEntry.numeroCompiti = authorEntry.compiti.length;
            } else {
                acc.push({ nome: e.authorName, numeroCompiti: 1, showCompiti: false, compiti: [e] });
            }
            return acc;
        }, []);

        let returnWork = $state(arrangedWork)

        return returnWork;
    }

    // Check if a given day matches today's date
    function isToday(dayNumber: number) {
        return dayNumber === today.dayNumber + 1 && monthIndex === today.month && year === today.year;
    }

    // Display the lessons in a popup for a specific day
    let toShowLessons: {}[] = $state([]);
    function showLessonsPopup(dayIndex: number, lesson: { showModal: boolean } | undefined) {
        if (lesson == undefined) {
            const dayStr = dayIndex < 10 ? `0${dayIndex}` : String(dayIndex);
            const monthStr = monthIndex + 1 < 10 ? `0${monthIndex + 1}` : String(monthIndex + 1);
            const toFindDate = `${year}-${monthStr}-${dayStr}`;

            // Add and show lessons for the specified day
            toShowLessons.push({
                id: toFindDate,
                lessons: lessons.filter((e: any) => e.evtDate === toFindDate),
                showModal: true
            });
        } else {
            lesson.showModal = true;
        }
    }

    // Determine if there are lessons for a specific day that have already occurred
    function checkDayLessons(day: number) {
        const dayDate = new Date(`${year}-${monthIndex + 1 < 10 ? `0${monthIndex + 1}` : String(monthIndex + 1)}-${day < 10 ? `0${day}` : String(day)}T00:00:00`);
        return dayDate <= date && hasDayAnyLessons(year, monthIndex + 1, day).length > 0;
    }

    function checkAbsence(day: number) {
        if (dayNames[day % 7] != 'Sun') {
            if (monthIndex == today.month && day - getFirstDayIndex >= today.dayNumber) {
                return false
            }
            return true
        } else {
            return false
        }
    }

</script>

<div id="calendar" class="flexcolumn page">
    <div id="actions" class="topFixed flexrow halign valign padding4">
        <div id="backArrow">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore event_directive_deprecated -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <i class="fa-solid fa-chevron-left" onclick={() => gotoPrevMonth()}></i>
        </div>
        <div class="flexcolumn gap-medium">
            <div id="month">
                {month}
            </div>
            <div id="year">
                {year}
            </div>
        </div>
        <div id="forwardArrow">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore event_directive_deprecated -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <i class="fa-solid fa-chevron-right" onclick={() => gotoNextMonth()}></i>
        </div>
    </div>
    <div id="daysNames" class="flexrow">
        {#each dayNames as dayName}
            <div class="dayName">
                <p>{dayName}</p>
            </div>
        {/each}
    </div>
    <div id="monthDays" class="flexcolumn">
        {#each Array(calendarRows) as _, i}
            <div class="flexrow">
                {#each Array(7) as _, y}
                    <div class="day" class:dayValid={(i * 7 + y)-getFirstDayIndex+1 > 0 && (i * 7 + y)-getFirstDayIndex+1 <= numberOfDays} class:today={today.dayNumber === (i * 7 + y)-getFirstDayIndex+1 && monthIndex === today.month && year === today.year}>
                        {#if (i * 7 + y)-getFirstDayIndex+1 > 0 && (i * 7 + y)-getFirstDayIndex+1 <= numberOfDays}
                            <div class="flexcolumn innerDay padding1">
                                <div class="flexrow space-between valign" style="flex-grow: 0;">
                                    <p class="padding2" style="width: 100%;" class:todayIcon={isToday((i * 7 + y)-getFirstDayIndex)}>{String((i * 7 + y)-getFirstDayIndex+1)}</p>
                                    <!-- {#if filter !== 'Lezioni'}
                                        {#if checkDayLessons((i * 7 + y)-getFirstDayIndex+1)}
                                            <div class="lezioni valign padding1"
                                            style="animation: show 1s {(i * 7 + y)*10}ms forwards;"
                                            onclick={() => showLessonsPopup((i * 7 + y)-getFirstDayIndex+1, undefined)}
                                            ><p>Lezioni</p></div>
                                            <LessonsDialog bind:showModal={toShowLessons} lessons={[toShowLessons]}></LessonsDialog>
                                        {/if}
                                    {/if} -->
                                </div>
                                {#if filter === 'Compiti'}
                                    <div class="compiti flexcolumn gap-small">
                                        {#each hasDayAnyWork(year, monthIndex+1, String((i * 7 + y)-getFirstDayIndex+1)) as dayWork, z}
                                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                                            <!-- svelte-ignore event_directive_deprecated -->
                                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                                            <div class="compito" 
                                            class:showCompiti={dayWork.showCompiti}
                                            onclick={() => dayWork.showCompiti = true}
                                            style="animation: show 1s {(i * 7 + y + (z * 20))*10}ms forwards;"
                                            >
                                                <div class="flexrow space-between hstartalign">
                                                    <b class="author" style="flex-grow: 2;">{capitalizeNames(dayWork.nome)}</b>
                                                    <!-- <p>{dayWork.numeroCompiti}</p> -->
                                                </div>
                                                {#if dayWork.showCompiti}
                                                    <Dialog compiti={dayWork.compiti} bind:showModal={dayWork.showCompiti} />
                                                {/if}
                                            </div>
                                        {/each}
                                    </div>
                                {:else if filter === 'Lezioni'}
                                    <div class="flexcolumn" style="gap: 2px">
                                        {#each hasDayAnyLessons(year, monthIndex+1, String((i * 7 + y)-getFirstDayIndex+1)) as dayLesson: $state([])}
                                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                                            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                            <p class="lezioni padding1" 
                                            onclick={() => showLessonsPopup((i * 7 + y)-getFirstDayIndex+1, dayLesson)}
                                            style="animation: show 1s {(i * 7 + y)*10}ms forwards; background-color: var(--card-color);"
                                            >{dayLesson.authorName}</p>
                                            {#if dayLesson.showModal}
                                                <LessonsDialog bind:showModal={dayLesson.showModal} lessons={[dayLesson]}></LessonsDialog>
                                            {/if}
                                            <!-- {dayLesson.showModal = true}-->
                                        {/each}
                                    </div>
                                {:else if filter === 'Assenze'}
                                    {#each Object(hasDayAnyAbsences(year, monthIndex+1, String((i * 7 + y)-getFirstDayIndex+1))) as dayAbsence: $state([])}
                                    {#if checkAbsence((i * 7 + y))}
                                            <p class="assenza flexrow gap-small" class:error={!dayAbsence.isJustified} class:ok={dayAbsence.isJustified} style="animation: show 1s {(i * 7 + y)*10}ms forwards;"
                                            ><span>{dayAbsence.info}</span><i class="fa-solid fa-calendar-xmark"></i></p>
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .lezioni {
        opacity: 0;
        font-size: 0.8rem;
        background-color: var(--font-info-color);
        border-radius: var(--border-radius-light);
        box-shadow: var(--shadow-color-light) 0px 0px 2px 0px;
        cursor: pointer;
    }
    .lezioni:hover {
        box-shadow: var(--shadow-color-light) 0px 0px 5px 2px !important;
    }
    .todayIcon {
        border-radius: var(--border-radius-light);
        width: min-content;
    }
    .assenza {
        opacity: 0;
        padding: 0.3rem;
        border-radius: var(--border-radius-light);
        font-size: 0.8rem;
        box-shadow: var(--shadow-color-light) 0px 0px 2px 0px;
        aspect-ratio: 1;
        max-height: 1rem !important;
        text-align: center;
        width: max-content !important;
    }
    .assenza:hover {
        box-shadow: var(--shadow-color-light) 0px 0px 5px 2px !important;
    }
    .compito:hover {
        box-shadow: var(--shadow-color-light) 0px 0px 10px 2px !important;
    }
    .compito * {
        justify-content: start;
        align-items: start;
        text-align: left;
    }
    .compito {
        opacity: 0;
        cursor: pointer;
        user-select: none;
        width: auto;
        box-shadow: var(--shadow-color-light) 0px 0px 2px 0px;
        background-color: var(--card-color);
        line-height: 1rem;
        padding: 0.5rem;
        border-radius: var(--border-radius-light);
        overflow: hidden;
        min-height: max-content;
        z-index: 0 !important;
    }
    #monthDays {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .flexrow {
        display: flex;
        flex: 1;
        justify-content: space-around;
    }

    .day {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 50px;
        min-height: 50px;
        width: 100%;
        height: 100% !important;
        transition-duration: 0s;
    }

    .innerDay {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
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
    #actions {
        padding: 1rem;
    }
    .dayValid p {
        margin: 0;
    }
    .dayValid{
        outline: 1px solid var(--background-blurry);
        border-radius: var(--border-radius-light);
    }
    .today {
        background-color: var(--accent-color-primary);
    }
    .flexrow {
        flex-wrap: nowrap !important;
    }
    .dayName {
        text-align: center;
        width: 100%;
    }
    #monthDays {
        overflow: scroll;
    }
    @media screen and (max-width: 900px) {
        .compito {
            font-size: 0.8rem !important;
        }
    }
</style>