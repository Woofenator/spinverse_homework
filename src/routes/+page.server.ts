import { db } from '#lib/server/db/index.ts';
import { researchers } from '#lib/server/db/schema.ts';
import { openaiClient } from '#lib/server/openai/client.ts';
import type { Actions } from './$types';

const MAX_RESULTS = 20;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const queryValue = formData.get('query');
		if (typeof queryValue !== 'string') {
			return { query: '', results: [] };
		}

		const query = queryValue.trim();
		if (!query) {
			return { query, results: [] };
		}

		const embedding = await openaiClient.generateEmbeddings(query);
		if (embedding.length === 0) {
			return { query, results: [] };
		}

		// TODO: Use sqlite-ai/vector extension to perform a search on the works table using the generated embedding. For now, we will just return all researchers.
		const results = await db.select().from(researchers);
		return { query, results };
	}
};
