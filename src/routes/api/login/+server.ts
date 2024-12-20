import { db } from '$lib/server/db';
import { users, products } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt'; 
import { eq } from 'drizzle-orm'; 

export const PUT: RequestHandler = async ({ request }) => {
    const { username, password } = await request.json();

    // Basic input validation
    if (!username || !password) {
        return json({ error: 'Username and password are required' }, { status: 400 });
    }

    console.log('Received login request:', { username, password });

    try {
        // Find user by username
        const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (user.length === 0) {
            console.log('No user found for username:', username);
            return json({ error: 'Invalid username or password' }, { status: 401 });
        }

        console.log('User found:', user[0]);

        // Validate password
        const isValid = await bcrypt.compare(password, user[0].password);
        if (!isValid) {
            console.log('Password mismatch for username:', username);
            return json({ error: 'Invalid username or password' }, { status: 401 });
        }

        console.log('Login successful for username:', username);

        // Mock a session/token 
        return json({ message: 'Login successful', userId: user[0].id });

    } catch (error) {
        console.error('Error during login:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
