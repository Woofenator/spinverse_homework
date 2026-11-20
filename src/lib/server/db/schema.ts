import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const researchers = sqliteTable('researchers', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	givenNames: text('given_names').notNull(),
	familyNames: text('family_names').notNull(),
	orcidId: text('orcid_id').notNull()
});

export const works = sqliteTable('works', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	researcherId: text('researcher_id')
		.notNull()
		.references(() => researchers.id),
	workPutCode: text('work_put_code').notNull(),
	title: text('title').notNull(),
	embeddings: blob('embeddings').notNull()
});
