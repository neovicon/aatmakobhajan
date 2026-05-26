import { z } from 'zod';

export const songCreateSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().min(1),
  writer: z.string().optional().default('Unknown'),
  album: z.string().optional(),
  category: z.enum(['bhajan', 'chorus', 'others']).optional().default('bhajan'),
  tags: z.array(z.string()).optional().default([]),
  nepaliLyrics: z.string().min(1),
  romanizedLyrics: z.string().min(1),
  description: z.string().max(500).optional(),
  coverImage: z.string().optional(),
  audioUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal(''))
});

export const songUpdateSchema = songCreateSchema.partial();
