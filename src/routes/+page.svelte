<script lang="ts">

</script>

<div class="page padding4">
    <div class="flexrow">
        <div class="flexcolumn gap-large">
            <div class="flexcolumn" id="top">
                <h2>Welcome!</h2>
                <h3>This is a frontend for <a href="https://web.spaggiari.eu">Spaggiari</a> made in <a href="https://svelte.dev/">SvelteKit</a> by <a href="https://salanileo.dev">Leonardo Salani</a> (me :D).
                <br>I realized this website because I hate the official one made in php.</h3>
                <p>No data is collected or tracked in any way by this website</p>
                <p>To start using this website you need a spaggiari account, then <a href="/auth/login">login</a> and you'll have access to everything</p>
                <p style="margin-top: 1rem;">Documentation about the api used is <a href="https://github.com/Lioydiano/Classeviva-Official-Endpoints/tree/master">here.</a> All credits go to the owners of the github repository. Without them I wouldn't have made this.</p>
                <p>The provided api for the backend do not include any endpoint for teachers. It would be cool if they made them public and open source by requesting an api key as developer to use with the apis.</p>
            </div>
            <div class="flexcolumn">
                <h3>If this website ever gets any attention I'm open for work :p, also check out <a href="https://salanileo.dev">salanileo.dev</a>.</h3>
                <p>Last thing: Spaggiari's apis suck for the most part, like why do you responde with an array of single grades when I request them instead of dividing it by (for example) subjects? This kind of stuff should be done in the backend, not trying to create usable JSON in the frontend</p>
            </div>
            <div class="flexcolumn">
                <h2>Working tabs:</h2>
                <ul>
                    <li>Grades, not yet divided by quadrimester</li>
                    <li>Notice Board</li>
                    <li>Calendar, with: Agenda, Lessons, Absences</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
    h2, p {
        margin: 0;
    }
</style>