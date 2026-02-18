import { z } from "zod/v4";
import {
  IDEA_MIN_LENGTH,
  IDEA_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
} from "@/lib/constants";
import { sanitizeHtml } from "@/lib/security";

export const ideaSchema = z.object({
  content: z
    .string()
    .min(IDEA_MIN_LENGTH, `La idea debe tener al menos ${IDEA_MIN_LENGTH} caracteres`)
    .max(IDEA_MAX_LENGTH, `La idea no puede superar ${IDEA_MAX_LENGTH} caracteres`)
    .trim()
    .transform((val) => sanitizeHtml(val)),
});

export const voteSchema = z.object({
  ideaId: z.string().uuid("ID de idea no válido"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email no válido")
    .max(255, "Email demasiado largo")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
    .max(PASSWORD_MAX_LENGTH, "Contraseña demasiado larga"),
});

export const registerSchema = loginSchema.extend({
  displayName: z
    .string()
    .min(DISPLAY_NAME_MIN_LENGTH, `El nombre debe tener al menos ${DISPLAY_NAME_MIN_LENGTH} caracteres`)
    .max(DISPLAY_NAME_MAX_LENGTH, `El nombre no puede superar ${DISPLAY_NAME_MAX_LENGTH} caracteres`)
    .trim()
    .transform((val) => sanitizeHtml(val)),
});
