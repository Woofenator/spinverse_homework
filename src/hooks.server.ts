import { db } from '#lib/server/db/index.ts';
import { researchers, works } from '#lib/server/db/schema.ts';
import { openaiClient } from '#lib/server/openai/client.ts';
import { orcidClient } from '#lib/server/orcid/client.ts';
import type { ServerInit } from '@sveltejs/kit/hooks';
import { eq } from 'drizzle-orm';
import { setTimeout } from 'node:timers/promises';

const MAX_PAGES = 1;

const seedData = async (): Promise<void> => {
	for (let page = 0; page < MAX_PAGES; page++) {
		const recordsResponse = await orcidClient.fetchRecords(page * 10, 10);
		const records = (await recordsResponse.json()) as {
			'expanded-result': {
				'orcid-id': string;
				'given-names': string;
				'family-names': string;
			}[];
		};

		for (const record of records['expanded-result']) {
			let researcher = db
				.select()
				.from(researchers)
				.where(eq(researchers.orcidId, record['orcid-id']))
				.get();

			if (!researcher) {
				db.insert(researchers)
					.values({
						givenNames: record['given-names'] ?? '',
						familyNames: record['family-names'] ?? '',
						orcidId: record['orcid-id']
					})
					.run();

				researcher = db
					.select()
					.from(researchers)
					.where(eq(researchers.orcidId, record['orcid-id']))
					.get();
			}

			if (!researcher) {
				throw new Error(`Failed to load researcher ${record['orcid-id']}`);
			}

			const worksResponse = await orcidClient.fetchWorks(record['orcid-id']);
			const worksObj = (await worksResponse.json()) as {
				group?: { 'work-summary': { 'put-code': string; title: { title: { value: string } } }[] }[];
			};

			if (!worksObj.group || worksObj.group.length === 0) {
				continue;
			}

			for (const workGroup of worksObj.group) {
				for (const work of workGroup['work-summary']) {
					const existingWork = db
						.select()
						.from(works)
						.where(eq(works.workPutCode, work['put-code']))
						.get();

					if (existingWork) {
						continue;
					}

					const [embeddings] = await Promise.all([
						openaiClient.generateEmbeddings(work.title.title.value),
						setTimeout(5000)
					]);
					db.insert(works)
						.values({
							researcherId: researcher.id,
							workPutCode: work['put-code'],
							title: work.title.title.value,
							embeddings: new Uint8Array(new Float32Array(embeddings).buffer)
						})
						.run();
				}
			}
		}
	}
};

export const init: ServerInit = () => {
	void seedData().catch((error: unknown) => {
		console.error('Failed to seed data in the background:', error);
	});
};
