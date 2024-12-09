import { db } from '$lib/server/db';
import { cart } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
    const { userId, cartIds } = await request.json();

    if (!userId || !cartIds || cartIds.length === 0) {
        return json({ error: 'User ID and selected cart items are required' }, { status: 400 });
    }

    try {
        // Delete the checked out items from the cart
        for (const cartId of cartIds) {
            await db
                .delete(cart)
                .where(eq(cart.id, cartId))
                .execute();
        }

        return json({ message: 'Checkout successful' });
    } catch (error) {
        console.error('Error during checkout:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};