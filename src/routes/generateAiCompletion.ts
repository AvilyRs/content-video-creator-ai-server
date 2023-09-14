import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openAi } from "../lib/openAi";

export async function generateAiCompletion(app: FastifyInstance) {
  app.post('/ai/complete', async (request, reply) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { videoId, template, temperature } = bodySchema.parse(request.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    if (!video.transcription) {
      return reply.status(400).send({
        error: 'Video trancription was not generated yet.'
      });
    }

    const promptMessage = template.replace('{transcription}', video.transcription);

    const response = await openAi.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature: temperature,
      messages: [
        {
          role: 'user',
          content: promptMessage,
        },
      ],
    });

    return response;
  });
}