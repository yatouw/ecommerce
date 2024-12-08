import { db } from '$lib/server/db';
import { cart, products } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// Add to Cart
export const POST: RequestHandler = async ({ request }) => {
    const { userId, productId, quantity } = await request.json();

    if (!userId || !productId || !quantity) {
        return json({ error: 'User ID, Product ID, and Quantity are required' }, { status: 400 });
    }

    try {
        // Check if the product already exists in the user's cart
        const existingCartItem = await db
            .select()
            .from(cart)
            .where((eq(cart.userId, userId), eq(cart.productId, productId))) // Combine conditions with `and()`
            .limit(1)
            .execute();

        if (existingCartItem.length > 0) {
            // Update quantity if the product already exists in the cart
            await db
                .update(cart)
                .set({ quantity: existingCartItem[0].quantity + quantity })
                .where(eq(cart.id, existingCartItem[0].id))
                .execute();
        } else {
            // Add new product to the cart
            await db.insert(cart).values({ userId, productId, quantity }).execute();
        }

        return json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
// Get Cart Items
export const GET: RequestHandler = async ({ url }) => {
    const userId = Number(url.searchParams.get('userId'));  // Convert userId to a number

    if (!userId) {
        return json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Fetch the user's cart items with product details
        const cartItems = await db
            .select({ cartId: cart.id, quantity: cart.quantity, product: products })
            .from(cart)
            .innerJoin(products, eq(cart.productId, products.id))
            .where(eq(cart.userId, userId))
            .execute();

        return json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
