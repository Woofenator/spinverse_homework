import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.' },
	OPENROUTER_API_KEY: { description: 'The OpenRouter API key.' }
});
