import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function generateSummary(data, type) {
	const serverName = __ENV.SERVER_NAME || "default-server";
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

	const jsonPath = `/k6/results/json/${serverName}-summary-${type}_${timestamp}.json`;
	const htmlPath = `/k6/results/html/${serverName}-report-${type}_${timestamp}.html`;

	console.log(`Summary JSON will be saved to ${jsonPath}`);
	console.log(`HTML report will be saved to ${htmlPath}`);

	return {
		stdout: textSummary(data, { indent: " ", enableColors: true }),
		[jsonPath]: JSON.stringify(data, null, 2),
		[htmlPath]: htmlReport(data),
	};
}
