import { parse } from 'valibot';
import { supabase } from "$lib/supabaseClient";

import { type Member, Member as MemberSchema } from '$lib/models/member';

const committeeMap: Record<string, string> = {
    SERVICE: 'Service',
    'M&I': 'Membership & Internals',
    ENGG: 'Engineering',
    BEX: 'Executive',
    INNOV: 'Innovation',
    EXTE: 'External Relations',
    BnC: 'Branding & Creatives',
};

export async function getTeam() {
    const { data, error } = await supabase
        .from("people")
        .select(`
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

    if (error) {
        console.error(error);
        throw new Error("team data fetching error");
    }

    const members: Member[] = data.map((person) => {
        const comm = committeeMap[person.committee]!;

        // a quirk of the DB setup,
        // if the comm is set to Executive then thats the president,
        // otherwise if the person is_exec then they have two comms,
        // everone else has only one comm
        const committees =
            comm === "Executive" || !person.is_exec
                ? [comm]
                : person.is_exec
                ? [comm, "Executive"]
                : [comm];

        const socials: Record<string, string> = {};

        if (person.github_handle) socials.github = person.github_handle;
        if (person.linkedin_url) socials.linkedin = person.linkedin_url;
        if (person.instagram_url) socials.instagram = person.instagram_url;
        if (person.website_url) socials.website = person.website_url;

        const member: Member = {
            name: `${person.nickname} ${person.last_name}`,
            img: person.image_url,
            committee: committees,
            socials: socials,
            src: person.image_url
        }

        return member
    });
    
    return members
}
