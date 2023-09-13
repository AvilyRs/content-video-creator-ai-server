import { fastify } from 'fastify';
import { getAllPromptsRoute } from './routes/getAllPrompts';

const app = fastify();

app.register(getAllPromptsRoute);

app.listen({
  port: 3333
}).then(() => {
  console.log('Server Running on http://localhost:3333')
});