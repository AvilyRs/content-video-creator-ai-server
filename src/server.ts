import { fastify } from 'fastify';

import { getAllPromptsRoute } from './routes/getAllPrompts';
import { uploadVideosRoute } from './routes/uploadVideos';
import { createTranscription } from './routes/createTranscription';
import { generateAiCompletion } from './routes/generateAiCompletion';
import fastifyCors from '@fastify/cors';

const app = fastify();

app.register(fastifyCors, {
  origin: '*'
});

app.register(getAllPromptsRoute);
app.register(uploadVideosRoute);
app.register(createTranscription);
app.register(generateAiCompletion);

app.listen({
  port: 3333
}).then(() => {
  console.log('Server Running on http://localhost:3333')
});