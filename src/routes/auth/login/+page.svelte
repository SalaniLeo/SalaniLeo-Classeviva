<script lang="ts">
    let username: String;
    let password: String;
	export let form;
</script>

<div class="content halign valign">
    <div class="page padding4 valign halign">
        <div class="flexcolumn gap-large halign valign">
            <h2>Login</h2>
            <form class="login flexcolumn gap-medium vendalign" method="POST">
                <div class="inputcell">
                    <label for="username">Username: </label>
                    <input bind:value={username}
                    style="border-bottom: 2px solid {form?.state};"
                    type="text" id="username" name="username">
                </div>
                <div class="inputcell">
                    <label for="pass">Password: </label>
                    <input bind:value={password} type="password"
                    style="border-bottom: 2px solid {form?.state};"
                    id="password" name="password">
                </div>
                <p class="loginMessage" style="margin: 0px; color: {form?.state}">{form?.error}</p>
                <input type="submit" value="Submit" class="button">
            </form>
        </div>
    </div>
</div>

<style>
    .loginMessage {
        height: 20px;
    }
    .content {
        height: 90%;
    }
    .page {
        width: min-content;
        height: unset !important;
    }
    /* .page {
        height: 100%;
    } */
    h2 {
        margin: 0px;
    }
    .inputcell {
        display: flex;
        justify-content: space-between;
        width: 20rem;
        align-items: center;
    }
</style>