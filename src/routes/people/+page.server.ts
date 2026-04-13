import type { Member } from '$lib/models/member';
import { MemberCommittees } from '$lib/types/committees';

import { getExecBoards } from '$lib/data/exec';
import { getTeam } from '$lib/data/team';

export async function load() {
    const team = await getTeam();

    const filteredTeams: Record<string, Member[]> = {};
    Object.keys(MemberCommittees).forEach(filterComm => {
        filteredTeams[filterComm] = team.filter(({ committees }) => {
            let in_committee = false;
            committees.forEach(comm => {
                in_committee ||= comm === filterComm;
            });
            return in_committee;
        });
    });

    return { team, filteredTeams, execBoards: await getExecBoards() };
}
