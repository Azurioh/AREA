import { sleep } from "k6";
import http from "k6/http";
import { generateSummary } from "./utils/summary.js";

export const options = {
	vus: 100,
	duration: "1h",
};

export default function () {
	http.get("http://host.docker.internal:3001/ping");
	sleep(1);
}

export function handleSummary(data) {
	return generateSummary(data, "soak");
}
