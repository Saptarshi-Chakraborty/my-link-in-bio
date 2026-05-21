import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/api",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

app.get('/admin', async (c) => {
	return c.env.ASSETS.fetch(new Request(new URL('/admin/index.html', c.req.url)))
})

app.get('/admin/*', async (c) => {
	return c.env.ASSETS.fetch(new Request(new URL('/admin/index.html', c.req.url)))
})

app.get('/', (c) => {
	return c.html('<h1>Welcome to Likify!</h1><p>Visit <a href="/admin">/admin</a> to manage your account.</p>')
})

app.get('/:username{[a-zA-Z0-9_-]+}', async (c) => {
	const username = c.req.param('username')
	return c.html(`<h1>User: ${username}</h1>`)
})

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
