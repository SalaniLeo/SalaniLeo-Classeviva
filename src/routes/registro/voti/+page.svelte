<script lang="ts">
	import { capitalizeFirstLetter } from '$lib';

    export let data;

    const grades = data.grades;

    let median: number = 0
    let i: number = 0

    grades.forEach((grade: {decimalValue: number}) => {
        i++;
        median += grade.decimalValue;
    });

    median = Math.round(median * 10 / i) / 10

    let subjects: any[] = []

    grades.forEach((grade: {
		displayValue: any;
		subjectDesc: any;
		evtId: number; decimalValue: number;subjectId: number 
        }) => { 
        if(containsMateria(subjects, grade.subjectId)) {
            let materia = getObjectByMateria(subjects, grade.subjectId)
            materia.voti.push({
                "id": grade.evtId,
                "decimal": grade.decimalValue,
                "display": grade.displayValue
            })
        } else {
            subjects.push({
                "materia": grade.subjectId,
                "nome": grade.subjectDesc,
                "voti": [
                    {
                        "id": grade.evtId,
                        "decimal": grade.decimalValue,
                        "display": grade.displayValue
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
        voti.forEach((voto: {decimal: number}) => {
            total += voto.decimal
            i += 1;
        })
        return total / i
    }

</script>

<div class="page">
    <div class="flexcolumn gap-large padding3">
        <div class="flexcolumn">
            <div class="overview flexrow gap-medium valign">
                <h2>Media totale: </h2>
                <div class="grade" class:ok={median >= 6} 
                    class:alert={median < 6 &&median > 5}>
                    {median}
                </div>
            </div>
        </div>
            {#each subjects as subject, i}
                <div class="flexcolumn gap-medium materia"
                    style="animation: show 1s {i*50}ms forwards;"
                >
                    <h3>{capitalizeFirstLetter(subject.nome)}</h3>
                    <div class="flexcolumn gap-medium">
                        <div class="mediaMateria">
                            <p class="valign">Media:</p>
                            <div class="grade" class:ok={getMediaMateria(subject.voti) >= 6}
                                class:alert={getMediaMateria(subject.voti) < 6 && getMediaMateria(subject.voti) > 5}>
                                {getMediaMateria(subject.voti)}
                            </div>
                        </div>

                        <div class="votiMateria">
                            <p class="valign">Voti:</p>
                            <div class="flexrow gap-small">
                                {#each subject.voti as voto}
                                <div class="grade" class:ok={voto.decimal >= 6}
                                    class:alert={voto.decimal < 6 && voto.decimal > 5}>
                                    {voto.display}
                                </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
    </div>
</div>

<style>
    .materia {
        opacity: 0;
    }
    h3, p {
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
</style>