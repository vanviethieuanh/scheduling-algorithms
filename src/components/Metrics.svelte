<script lang="ts">
    export let quantumnTime: number
</script>

<div>
    <div class="settings">
        <div>Quantum Time</div>
        <input
            type="number"
            min="1"
            id="quantumn-time"
            bind:value={quantumnTime}
        />
    </div>
</div>

<style lang="scss">
    .settings {
        height: fit-content;

        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr 1fr;
        gap: 0.5rem;

        align-items: center;
        justify-content: left;

        color: white;

        * {
            text-align: left;
        }

        div {
            user-select: none;
        }

        #quantumn-time {
            max-width: 50px;

            padding: 0.5rem;
            color: white;

            margin: 0;

            background-color: rgba($color: #fff, $alpha: 0.1);
            border: rgba($color: #fff, $alpha: 0.1) 1px solid;

            &:hover {
                background-color: rgba($color: #fff, $alpha: 0.2);
                border: rgba($color: #fff, $alpha: 0.5) 1px solid;
            }

            &:focus {
                background-color: rgba($color: #fff, $alpha: 0.2);
                border: rgba($color: #fff, $alpha: 0.5) 1px solid;
                outline: none;
            }
        }
    }
</style>
