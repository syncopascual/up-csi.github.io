import { supabase } from '$lib/supabaseClient';
import { Member } from '$lib/models/member';
import { array, parse } from 'valibot';

export async function getTeam() {
    const { data, error } = await supabase.from('people').select(`
        id,
        last_name,
        nickname,
        image_url,
        committee,
        is_exec,
        github_handle,
        linkedin_url,
        instagram_url,
        website_url
    `);

    if (error) throw new Error('team data fetching error');

    const members = parse(array(Member), data).map(({
        committee,
        is_exec,
        github_handle,
        linkedin_url,
        instagram_url,
        website_url,
        ...rest
    }) => {
        // a quirk of the DB setup,
        // if the comm is set to Executive then thats the president,
        // otherwise if the person is_exec then they have two comms,
        // everone else has only one comm
        const committees = [committee];
        if (is_exec && committee !== 'Executive') committees.push('Executive');

        const socials: Record<string, string> = {};

        if (github_handle) socials.github = github_handle;
        if (linkedin_url) socials.linkedin = linkedin_url;
        if (instagram_url) socials.instagram = instagram_url;
        if (website_url) socials.website = website_url;

        return {
            ...rest,
            committees,
            socials
        };
    });

    // Sorts members by nickname (or last name if nickname is the same)
    return members.sort((a, b) => a.nickname.localeCompare(b.nickname) || a.last_name.localeCompare(b.last_name));
}
