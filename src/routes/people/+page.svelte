<script>
    import { pres_term } from '$lib/data/exec';

    import Accordion from '$lib/components/accordions/Accordion.svelte';
    import AccordionPanel from '$lib/components/panels/AccordionPanel.svelte';
    import ExecPanel from '$lib/components/panels/ExecPanel.svelte';
    import TeamPanel from '$lib/components/panels/TeamPanel.svelte';

    const { data } = $props();
    const { team, filteredTeams, execBoards } = $derived(data);
</script>

<div class="py-6">
    <TeamPanel {team} {filteredTeams} />
</div>

<section class="w-full">
    <h1 class="border-csi-blue text-foreground mb-8 border-b-3 pb-4 text-center text-3xl">
        Meet the previous executive boards
    </h1>
    <AccordionPanel>
        {#each execBoards as { term, executives } (term)}
            {#if term !== pres_term}
                <Accordion title={term}>
                    <ExecPanel {executives} />
                </Accordion>
            {/if}
        {/each}
    </AccordionPanel>
</section>
