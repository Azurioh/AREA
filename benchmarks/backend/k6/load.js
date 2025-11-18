import http from "k6/http";
import { generateSummary } from "./utils/summary.js";

export const options = {
	stages: [
		{ duration: "20s", target: 50 },
		{ duration: "20s", target: 200 },
		{ duration: "20s", target: 500 },
	],
};

export default function () {
	http.get("http://host.docker.internal:3001/ping");
}

export function handleSummary(data) {
	return generateSummary(data, "load");
}
