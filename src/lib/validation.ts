// src/lib/validation.ts
import { z } from "zod";

export const emailSchema = z.string().email();
export const phoneSchema = z.string().regex(/^\+\d{9,15}$/);
export const idSchema = z.string().uuid();
