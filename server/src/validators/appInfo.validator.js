import { z } from 'zod';

export const appInfoUpdateSchema = z.object({
  developerDescription: z.string().optional(),
  writerDescription: z.string().optional(),
  appDescription: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().url().or(z.literal('')).optional(),
    instagram: z.string().url().or(z.literal('')).optional(),
    youtube: z.string().url().or(z.literal('')).optional(),
    github: z.string().url().or(z.literal('')).optional()
  }).optional()
});
