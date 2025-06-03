import { z } from "zod";

const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  verificationCode: z
    .string()
    .regex(/^\d{6}$/, "Verification code must be a 6-digit number"),
});

export default verifyEmailSchema;
