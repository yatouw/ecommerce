import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('tblUser', {
	id: integer('id').primaryKey({autoIncrement: true}),
	username: text('username').unique().notNull(),
	password: text('password').notNull()
});
