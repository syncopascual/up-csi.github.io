import { array, object, string, type InferOutput } from "valibot";
import { Executive } from "$lib/models/executive";

export const Board = object({
    term: string(),
    executives: array(Executive),
});

export type Board = InferOutput<typeof Board>;