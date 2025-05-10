import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be at most 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

export default resetPasswordSchema
