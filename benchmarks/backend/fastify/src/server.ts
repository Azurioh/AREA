import fastify from "fastify";

const app = fastify();

app.get("/ping", async (_request, reply) => {
	return reply.send({ ok: true });
});

app.listen({ port: 3000, host: "0.0.0.0" }, () => {
	console.log("Server is running on port 3000");
});
