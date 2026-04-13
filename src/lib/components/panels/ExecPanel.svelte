<script lang="ts">
    import { getCommitteeInfo } from '$lib/types/committees';

    import Card from '$lib/components/cards/MemberCard.svelte';
    import type { Executive } from '$lib/models/executive';

    interface Props {
        executives: Executive[];
    }

    const { executives }: Props = $props();
    const { color, foreground } = getCommitteeInfo('Executive');
</script>

<section
    class="grid w-full grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5"
>
    {#each executives as { id, nickname, last_name, image_url, titles } (id)}
        <Card {nickname} {last_name} {image_url} {titles} {color} {foreground} />
    {/each}
</section>
