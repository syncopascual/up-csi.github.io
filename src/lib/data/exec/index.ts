import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import { parse } from 'valibot';
import { supabase } from '$lib/supabaseClient';

import { type Officer, Officer as OfficerSchema } from '$lib/models/officer';
import { type Position, Position as PositionSchema } from '$lib/models/position';
import type { Board } from '$lib/types/board';
import type { BoardOfficer } from '$lib/types/board_officer';

interface ExecRow {
    term: string;
    execs: {
        id: number;
        last_name: string;
        nickname: string;
        image_url: string;
    };
    positions: {
        title: string;
    };
}

export const pres_term = '2526A';

async function getOfficers() {
    const { data, error } = await supabase
        .from('executive_terms')
        .select(
            `
            term,
            execs (
                id,
                last_name,
                nickname,
                image_url
            ),
            positions (
                title
            )
        `,
        )
        .overrideTypes<ExecRow[]>();

    if (error) throw new Error('exec data fetching error');

    const exec_map = new Map();
    data.forEach(({ term, execs, positions }) => {
        if (!execs || !positions) return;

        const { id, last_name, nickname, image_url } = execs;
        const { title } = positions;

        if (exec_map.has(id)) exec_map.get(id).pos.push(`${term}:${title}`);
        else
            exec_map.set(id, {
                name: {
                    last_name,
                    nickname,
                },
                img: image_url,
                pos: [`${term}:${title}`],
            });
    });
    const imports = Array.from(exec_map.values());

    const promises = Object.entries(imports).map(([_, asset]) => {
        const officer = parse(OfficerSchema, asset);

        const src: string = officer.img;

        const parsed_pos: Record<string, Position[]> = {};

        officer.pos.forEach(raw_detail => {
            const detail = raw_detail.split(':');
            const [term, raw_actual_pos] = detail;
            const actual_pos: Position = parse(PositionSchema, raw_actual_pos);

            if (term) {
                if (!parsed_pos[term]) parsed_pos[term] = [];

                parsed_pos[term].push(actual_pos);
            }
        });

        const parsed_officer: Officer = { ...officer, parsed_pos, src };
        return parsed_officer;
    });

    return promises.sort((a, b) => a.name.nickname.localeCompare(b.name.nickname));
}

export async function getExec() {
    const officers = await getOfficers();
    const boards: Record<string, Board> = {};

    officers.forEach(({ name, src, parsed_pos }) => {
        const { last_name, nickname } = name;
        const officer_name = `${nickname} ${last_name}`;

        Object.keys(parsed_pos).forEach(term => {
            const title = parsed_pos[term];
            if (title) {
                const new_officer: BoardOfficer = { name: officer_name, src, title };

                if (!boards[term]) {
                    const new_board: Board = { term, src: null, officers: [] };
                    boards[term] = new_board;
                }

                boards[term].officers.push(new_officer);
            }
        });
    });

    Object.keys(boards).forEach(async term => {
        // eslint-disable-next-line @typescript-eslint/init-declarations
        let src: EnhancedImgAttributes['src'] | null;
        try {
            src = (await import(`$lib/assets/exec/${term}.webp?enhanced?url`)).default;
        } catch {
            src = null;
        }

        if (boards[term]) boards[term].src = src;
    });

    return boards;
}
