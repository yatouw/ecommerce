import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt'; 
import { eq } from 'drizzle-orm'; 

// Register
export const POST: RequestHandler = async ({ request }) => {
    const { username, password } = await request.json();

    // Basic input validation
    if (!username || !password) {
        return json({ error: 'Username and password are required' }, { status: 400 });
    }

    try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (existingUser.length > 0) {
            return json({ error: 'Username already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.insert(users).values({ username, password: hashedPassword });
        return json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during registration:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};