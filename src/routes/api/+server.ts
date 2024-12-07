import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';


export const GET: RequestHandler = async () => {
    const results = await db.select().from(users)


    return json({Message: 'hi, crush this is get'});
};


export const POST: RequestHandler = async ({request}) => {
    // const {username} = await request.json();
    // console.log(username);

    const user = await db.insert(users).values({username:'jayvee', password: '12345678'});

    return json({Message: 'hi, crush this is post'});
};