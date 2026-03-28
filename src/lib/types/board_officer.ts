import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import type { Position } from '$lib/models/position';

export interface BoardOfficer {
    name: string;
    src: string;
    title: Position[];
}
