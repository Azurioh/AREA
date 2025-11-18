import http from "k6/http";
import { generateSummary } from "./utils/summary.js";

export const options = {
	stages: [
		{ duration: "20s", target: 50 },
		{ duration: "20s", target: 2000 },
		{ duration: "20s", target: 5000 },
	],
};

export default function () {
	http.get("http://host.docker.internal:3001/ping");
}

export function handleSummary(data) {
	return generateSummary(data, "stress");
}
