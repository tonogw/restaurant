import { z } from "zod";

// Validation schema
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 3 character"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 character"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type RegisterUser = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInputs = z.infer<typeof loginSchema>;
