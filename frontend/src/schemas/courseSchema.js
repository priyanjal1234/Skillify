import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], "Invalid level"),
  duration: z.preprocess(
    (val) => Number(val),
    z.number().positive("Duration must be a positive number")
  ),
  courseOutcome: z
    .array(z.string().min(1, "Each course outcome must be a non-empty string"))
    .min(1, "At least one course outcome is required"),
});

export default courseSchema;
