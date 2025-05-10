import { z } from "zod";

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

export default verifyOTPSchema;
