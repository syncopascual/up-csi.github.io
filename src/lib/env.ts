import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { parse, string } from 'valibot';

export const SUPABASE_PUBLISHABLE_KEY = parse(
    string('PUBLIC_SUPABASE_PUBLISHABLE_KEY not supplied or not a string'),
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
export const SUPABASE_URL = parse(
    string('PUBLIC_SUPABASE_URL not supplied or not a string'),
    PUBLIC_SUPABASE_URL,
);
