class ORCIDClient {
	readonly baseUrl = 'https://pub.orcid.org/v3.0';

	async fetchRecords(start: number = 0, rows: number = 100) {
		return fetch(`${this.baseUrl}/expanded-search/?q=start=${start}&rows=${rows}`, {
			headers: {
				Accept: 'application/json'
			}
		});
	}

	async fetchWorks(orcid: string) {
		return fetch(`${this.baseUrl}/${orcid}/works`, {
			headers: {
				Accept: 'application/json'
			}
		});
	}
}

export const orcidClient = new ORCIDClient();
