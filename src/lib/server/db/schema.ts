import { sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('tblUser', {
	id: integer('id').primaryKey({autoIncrement: true}),
	username: text('username').unique().notNull(),
	password: text('password').notNull()
});

export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    price: real('price').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(),
    image: text('image').notNull(),
});

export const cart = sqliteTable('cart', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('userId').notNull().references(() => users.id), 
    productId: integer('productId').notNull().references(() => products.id),  
    quantity: integer('quantity').notNull(),
});
