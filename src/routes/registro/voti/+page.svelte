<script lang="ts">
	import { capitalizeFirstLetter } from '$lib';
	import GradeLine from '$lib/components/gradeLine.svelte';
    import { LayerCake, Svg } from 'layercake';

    import Line from '$lib/charts/grades/_components/Area.svelte';
    import Area from '$lib/charts/grades/_components/Area.svelte';
    import AxisX from '$lib/charts/grades/_components/AxisX.svelte';
    import AxisY from '$lib/charts/grades/_components/AxisY.svelte';
    // import points from '$lib/charts/grades/_data/points.csv';

    let { data } = $props()
    console.log(data)
    const grades = data.grades;

    // svelte-ignore non_reactive_update
        let median: number = 0
    let i: number = 0

    grades.forEach((grade: {display: string;decimalValue: number}) => {
        if(grade.display !== '-') {
            i++;
            median += grade.decimalValue;
        }
    });

    median = Math.round(median * 10 / i) / 10

    let subjects: any[] = []

    grades.forEach((grade: {
		evtDate: any;
		periodDesc: any;
		periodPos: any;
		componentDesc: any;
		displayValue: any;
		subjectDesc: any;
		evtId: number; 
        decimalValue: number; 
        subjectId: number 
        }) => { 
        if(containsMateria(subjects, grade.subjectId)) {
            let materia = getObjectByMateria(subjects, grade.subjectId)
            materia.voti.push({
                "id": grade.evtId,
                "date": grade.evtDate,
                "decimal": grade.decimalValue,
                "display": grade.displayValue,
                "componentDesc": grade.componentDesc,
                "period": grade.periodPos,
                "periodDesc": grade.periodDesc
            })
        } else {
            subjects.push({
                "materia": grade.subjectId,
                "nome": grade.subjectDesc,
                "voti": [
                    {
                        "id": grade.evtId,
                        "date": grade.evtDate,
                        "decimal": grade.decimalValue,
                        "display": grade.displayValue,
                        "componentDesc": grade.componentDesc,
                        "period": grade.periodPos,
                        "periodDesc": grade.periodDesc
                    },
                ]
            })
        }
    });

    function containsMateria(array: any[], materiaNumber: any) {
        return array.some(item => item.materia === materiaNumber);
    }

    function getObjectByMateria(array: any[], materiaNumber: any) {
        return array.find((item: { materia: any; }) => item.materia === materiaNumber);
    }

    function getMediaMateria(voti: []) {
        let total = 0
        let i = 0
        voti.forEach((voto: {decimal: number, display: string}) => {
            if(voto.display !== '-') {
                total += voto.decimal
                i += 1;
            }
        })
        return Math.round((total / i)*10)/10
    }

    let showSubject = $state(false)
    let subjectToShow: object = $state({
        nome: '',
        voti: [
            {
                display: ''
            }
        ]
    })
    let subjectGraphMap = $state([])

    function getSubjectsDetails(subject: {voti: []} | any) {
        subjectToShow = subject

        subjectGraphMap = subject.voti.map((grade: { decimal: any; }, index: number) => ({
            x: index,
            y: grade.decimal
        }));
        console.log(subjectGraphMap)
        showSubject = true
    }

    function hideSubject() {
        showSubject = false
    }

    let degreeDescription = $state()
    function setDegreeDescription(desc: string) {
        degreeDescription = desc
    }

    let width = $state(0)

    $effect(() => {
        console.log(width)
    })

</script>

<svelte:body bind:clientWidth={width} />

<div class="page flexrow space-between">
    {#if !showSubject && width > 860 || showSubject && width > 860 || !showSubject && width < 860}
        <div class="gradeView flexcolumn padding3 gap-large" class:hide2={showSubject}>
            <div class="flexrow valign gap-moderate">
                <h2>Media totale: </h2>
                <GradeLine number={median}></GradeLine>
            </div>
            <div class="flexcolumn gap-large">
                {#each subjects as subject, i}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <div class="flexcolumn gap-small materia"
                        style="animation: show 1s {i*50}ms forwards;"
                        onclick={() => getSubjectsDetails(subject)}>
        
                        <div class="flexrow gap-medium space-between">
                            <h3>{capitalizeFirstLetter(subject.nome).length > 50 ? String(capitalizeFirstLetter(subject.nome)).slice(0, 50) + "..." : capitalizeFirstLetter(subject.nome) }</h3>
                            <GradeLine number={getMediaMateria(subject.voti)}></GradeLine>
                        </div>
        
                        <div class="flexrow gap-small">
                            {#each subject.voti as voto}
                                <div class="grade" class:ok={voto.decimal >= 6}
                                    class:alert={voto.decimal < 6 && voto.decimal >= 5} class:info={voto.display === '-'}>
                                    {voto.display}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div> 
    {/if}
    {#if showSubject}
        <div class=" flexcolumn sidebar padding3 gap-moderate">
            <div class="flexrow vstartalign space-between">
                <h2>{capitalizeFirstLetter(subjectToShow.nome).length > 50 ? String(capitalizeFirstLetter(subjectToShow.nome)).slice(0, 50) + "..." : capitalizeFirstLetter(subjectToShow.nome) }</h2>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button onclick={hideSubject} class="transparent">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Close_Circle"> <path id="Vector" d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="var(--font-primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                </button>
            </div>
            <div class="advancedView flexcolumn gap-moderate">
                <div class="flexrow gap-medium">
                    <h3>Media:</h3>
                    <GradeLine number={getMediaMateria(subjectToShow.voti)}></GradeLine>
                </div>
                <div class="flexcolumn gap-small">
                    <h3>Voti:</h3>
                    <div class="flexrow gap-small">
                        {#each subjectToShow.voti as voto}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div
                                onclick={() => setDegreeDescription(voto)}
                                style="cursor: pointer;"
                                class="grade" class:ok={voto.decimal >= 6}
                                class:alert={voto.decimal < 6 && voto.decimal >= 5} class:info={voto.display === '-'}>
                                {voto.display}
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="descrizioneVoto flexcolumn gap-small">
                    <h3>Descrizione voto:</h3>
                    {#if degreeDescription}
                        <p>{degreeDescription.date}</p>
                        <p>{degreeDescription.decimal}</p>
                        <p>{degreeDescription.componentDesc}</p>
                        <p>{degreeDescription.period}˚ {degreeDescription.periodDesc}</p>
                    {:else}
                        <p>Clicca un voto</p>
                    {/if}
                </div>
                <div class="subjectGraph">
                    <h3>Andamento voti</h3>
                    {#if Object.values(subjectToShow.voti).length > 1}
                        <div class="chart-container padding3">
                            <LayerCake
                                yDomain={[4, 10]}
                                x="x" y="y" data={subjectGraphMap}
                                xPadding= { [10, 10] }
                                yPadding= { [0, 10] }
                                >
                                <Svg>
                                    <AxisX format={(num) => {
                                        return num % 1 === 0 ? subjectToShow.voti[num / 1].display : ''
                                    }}
                                    />
                                    <AxisY ticks={6} />
                                    <Line />
                                    <Area />
                                </Svg>
                            </LayerCake>
                        </div>
                    {:else}
                        Hai bisogno di almeno due voti
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .chart-container {
        height: 200px;
    }
    .sidebar {
        border-left: 1px solid black;
        background-color: var(--accent-color-primary);
        width: 20%;
        min-width: 250px;
    }
    .flexrow {
        flex-wrap: nowrap;
    }

    .materia {
        cursor: pointer;
        background-color: var(--accent-color-primary);
        padding: 0.5rem;
        border-radius: var(--border-radius-medium);
        opacity: 0;
    }
    h3, h2, p {
        margin: 0;
    }
    .grade {
        border-radius: var(--border-radius-medium);
        padding: 0.5rem;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media screen and (max-width: 860px) {
        .sidebar {
            border-left: unset;
            width: 100%;
            /* min-width: 200px; */
        }
    }
</style>