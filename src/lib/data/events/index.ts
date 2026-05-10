import { parse } from 'valibot';

import { type Event, Event as EventSchema } from '$lib/models/event';
import type { State } from '$lib/types/state';

import { supabase } from '$lib/supabaseClient';

import { type EventSession, dummy_session } from '$lib/types/event_session';

export async function getEvents() {
    const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, name, tag, description, slug')
        .order('id');
    
    if (eventsError) throw new Error('events data fetching error');

    const { data: sessionsData, error: sessionsError } = await supabase
        .from('event_sessions')
        .select('event_id, audience_type, start_time, end_time, session_desc')

    if (sessionsError) throw new Error('event_sessions data fetching error');

    const sessionsByEventId: Record<
        number,
        { audience_type: string; start_time: string; end_time: string; session_desc: string | null }[]
    > = {};

    // checking jic sessionsData is null
    for (const s of sessionsData ?? []) {
        const event_id = s.event_id;
        
        // init the value for records
        if (!sessionsByEventId[event_id]) sessionsByEventId[event_id] = [];
        sessionsByEventId[event_id]!.push({
            audience_type: s.audience_type,
            start_time: s.start_time,
            end_time: s.end_time,
            session_desc: s.session_desc
        })
    }

    const events: Event[] = [];
    for (const eventData of eventsData ?? []) {
        const event = parse(EventSchema, eventData);

        const currEventSessions = sessionsByEventId[eventData.id] ?? [];

        const parsed_sessions: EventSession[] = currEventSessions.map(s => ({
            type: s.audience_type as 'Internal' | 'External',
            start: new Date(s.start_time),
            end: new Date(s.end_time),
            description: s.session_desc ?? null
        }))

        parsed_sessions.sort((a, b) => b.end.getTime() - a.end.getTime());

        let state: State = 'Past';
        const present = new Date().getTime();
        let current_session: EventSession = parsed_sessions[0] ?? dummy_session;
        for (const ps of parsed_sessions) {
            const { start, end } = ps;
            if (end.getTime() < present) {
                state = 'Past';
            } else if (start.getTime() <= present) {
                state = 'Ongoing';
                current_session = ps;
            } else {
                if (state === 'Past') current_session = ps;

                state = 'Future';
            }
        }

        if (state === 'Past')
            current_session = parsed_sessions[parsed_sessions.length - 1] ?? dummy_session;

        
        events.push({ ...event, parsed_sessions, current_session, state } as Event);
    }
    
    return events;
}
