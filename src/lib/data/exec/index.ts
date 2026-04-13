import { array, parse } from 'valibot';
import { supabase } from '$lib/supabaseClient';

import { Board } from '$lib/models/board';

export const pres_term = '2526A';

export async function getExecBoards() {
    // Queries view that groups executives by term
    // View is already sorted in advance, so we can return it directly
    const { data, error } = await supabase
        .from('execs_by_term')
        .select(`
            term,
            executives
        `);

    if (error) throw new Error('exec data fetching error');

    const execBoards = parse(array(Board), data);

    // View is already sorted in advance (for both boards and executives), so we can return it directly
    return execBoards;
}
