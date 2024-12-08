import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema'; 
import { json, type RequestHandler } from '@sveltejs/kit';
import path from 'path'; 
import fs from 'fs'; 

// Add Product
export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();

    const name = formData.get('name')?.toString();
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const description = formData.get('description')?.toString();
    const category = formData.get('category')?.toString();
    const imageFile = formData.get('image') as File | null;

    if (!name || !price || !description || !category || !imageFile) {
        return json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        // Ensure upload directory exists
        const uploadDir = path.resolve('static/uploads/');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save the uploaded image
        const imagePath = path.join(uploadDir, imageFile.name);
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        fs.writeFileSync(imagePath, fileBuffer);

        // Insert product into the database
        await db.insert(products).values({
            name,
            price,
            description,
            category,
            image: `/uploads/${imageFile.name}`,
        });

        return json({ success: 'Product added successfully', price: `₱${price.toFixed(2)}` });
    } catch (error) {
        console.error('Error adding product:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    try {
        const allProducts = await db.select().from(products);
        return json(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};