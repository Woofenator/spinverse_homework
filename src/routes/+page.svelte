<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	let { form }: PageProps = $props();
</script>

<div class="p-4 sm:p-6 md:p-8">
	<div class="pb-6 text-center">
		<h1 class="text-2xl font-bold md:text-3xl lg:text-4xl">Search example</h1>
	</div>
	<div
		class="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]"
	>
		<div>
			<form
				method="POST"
				use:enhance={() =>
					async ({ update }) => {
						await update({ navigate: false });
					}}
			>
				<label class="sr-only" for="search-query">Search researchers</label>
				<div class="join w-full">
					<input
						id="search-query"
						class="input join-item min-w-0 flex-1"
						type="text"
						name="query"
						placeholder="Search..."
						value={form?.query ?? ''}
					/>
					<button class="btn join-item" type="submit">Search</button>
				</div>
			</form>
		</div>

		<section aria-live="polite" aria-labelledby="results-heading" class="min-w-0">
			<h2 id="results-heading" class="mb-3 text-xl font-semibold">Search results</h2>
			{#if form?.query != null}
				{#if form.results.length}
					<p class="mb-4 text-sm text-base-content/70">
						{form.results.length}
						{form.results.length === 1 ? 'result' : 'results'} for
						<span class="font-medium">“{form.query}”</span>
					</p>
					<ul class="divide-y divide-base-300 rounded-box border border-base-300">
						{#each form.results as result (result.id)}
							<li class="p-4">
								<p class="mt-1 text-sm text-base-content/70">Researcher: {result}</p>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="rounded-box border border-base-300 bg-base-200/50 p-6">
						<p class="font-medium">No results found for “{form.query}”.</p>
						<p class="mt-2 text-sm text-base-content/70">Try a different query.</p>
					</div>
				{/if}
			{:else}
				<div class="rounded-box border border-dashed border-base-300 p-6 text-base-content/70">
					<p>Search results will appear here.</p>
					<p class="mt-2 text-sm">Enter a query to get started.</p>
				</div>
			{/if}
		</section>
	</div>
</div>
