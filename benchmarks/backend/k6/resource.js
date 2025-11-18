import http from "k6/http";
import { Trend } from "k6/metrics";
import { generateSummary } from "./utils/summary.js";

const rpsTrend = new Trend("rps_trend");

export const options = {
	vus: 50,
	duration: "30s",
};

export default function () {
	const res = http.get("http://host.docker.internal:3001/ping");
	rpsTrend.add(res.timings.duration);
}

export function handleSummary(data) {
	return generateSummary(data, "resource");
}
