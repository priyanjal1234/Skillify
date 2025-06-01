import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
})

export default forgotPasswordSchema