<script lang="ts">
    import Icon from '@iconify/svelte';

    import type { Position } from '$lib/models/position';

    import { getSocialMedium } from '$lib/types/social_media';

    interface Props {
        name: string;
        titles?: Position[];
        socials?: Record<string, string>;
    }

    const { name, titles, socials }: Props = $props();
</script>

<div class="*:!m-0">
    <p class="text-md md:text-lg">{name}</p>
    {#if titles}
        <p class="text-xs leading-tight">
            {titles.join(', ')}
        </p>
    {/if}
</div>
<div class="flex flex-row flex-wrap gap-2">
    {#if socials}
        {#each Object.entries(socials) as [social, link] (social)}
            {@const { path, icon } = getSocialMedium(social)}
            {@const href = path === 'https://github.com' ? `${path}/${link}` : link}
            <a {href} target="_blank"
                ><Icon
                    {icon}
                    class="text-foreground hover:text-csi-blue md:text-csi-white size-5 transition-colors"
                /></a
            >
        {/each}
    {/if}
</div>
