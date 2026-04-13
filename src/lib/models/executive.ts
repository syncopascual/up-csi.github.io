import { array, number, object, pipe, string, url, type InferOutput } from "valibot";
import { Position } from "$lib/models/position";

export const Executive = object({
    id: number(),
    last_name: string(),
    nickname: string(),
    image_url: pipe(string(), url("Invalid image URL")),
    titles: array(Position)
});

export type Executive = InferOutput<typeof Executive>;