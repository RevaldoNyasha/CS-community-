import type { Post } from '@/types';

/*
 * Cover images for posts without an uploaded picture come from Picsum (picsum.photos): free, no
 * key, and the same seed always returns the same photo, so a post keeps its cover. Images are
 * requested at exactly the card's 16:7 shape (at 2x for sharp screens), so nothing is cropped.
 */

export const COVER_WIDTH = 800;
export const COVER_HEIGHT = 350;

/** The post's own image when it has one, otherwise a stock cover picked by post id. */
export function postImageUrl(
    post: Pick<Post, 'id' | 'attachment_is_image' | 'attachment_url'>,
) {
    return post.attachment_is_image && post.attachment_url
        ? post.attachment_url
        : `https://picsum.photos/seed/devcraft-${post.id}/${COVER_WIDTH}/${COVER_HEIGHT}`;
}
