import { db } from '$lib/server/db';
import { cart } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ params, request }) => {
    const cartId = Number(params.id);
    const { userId } = await request.json();

    if (!cartId || !userId) {
        return json({ error: 'Cart ID and User ID are required' }, { status: 400 });
    }

    try {
        await db
            .delete(cart)
            .where(and(
                eq(cart.id, cartId), 
                eq(cart.userId, userId)
            ))
            .execute();

        return json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const PATCH: RequestHandler = async ({ params, request }) => {
    const cartId = Number(params.id);
    const { userId, quantity } = await request.json();

    if (!cartId || !userId || quantity === undefined) {
        return json({ error: 'Cart ID, User ID, and Quantity are required' }, { status: 400 });
    }

    try {
        await db
            .update(cart)
            .set({ quantity: quantity })
            .where(and(
                eq(cart.id, cartId), 
                eq(cart.userId, userId)
            ))
            .execute();

        return json({ message: 'Cart item quantity updated successfully' });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};