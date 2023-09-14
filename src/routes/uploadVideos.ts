import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';
import * as uuid from 'uuid';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import path from "node:path";
import fs from 'node:fs';

import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideosRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25 // 25mb
    }
  });
  
  app.post('/videos', async (request, reply) => {
    const data = await request.file();
    
    if (!data) {
      return reply.status(400).send({
        error: 'Missing file input'
      });
    }

    const extension = path.extname(data.filename);

    if (extension !== '.mp3') {
      return reply.status(400).send({
        error: 'Invalid input type, pĺease upload a MP3'
      })
    }
    
    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${uuid.v4()}${extension}`;
    const uploadDistination = path.resolve(__dirname, '../../temp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDistination));

    const video = await prisma.video.create({
      data: {
        name: data.fieldname,
        path: uploadDistination,
      },
    });

    return {
      video,
    };
  });
}