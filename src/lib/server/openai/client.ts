import { OPENROUTER_API_KEY } from '$app/env/private';
import { OpenRouter } from '@openrouter/sdk';

class OpenAICLient {
	readonly client: OpenRouter;

	constructor() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.client = new OpenRouter({ apiKey: OPENROUTER_API_KEY });
	}

	async generateEmbeddings(text: string): Promise<number[]> {
		const embedding = await this.client.embeddings.generate({
			requestBody: {
				model: 'nvidia/nemotron-3.5-embed-8b:free',
				input: text
			}
		});

		if (typeof embedding === 'string') {
			return [];
		}

		return embedding.data[0].embedding as number[];
	}
}

export const openaiClient = new OpenAICLient();
