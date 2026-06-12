import { z } from "zod";

// Validation schema
export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 3 character" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 character" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password is required" }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type RegisterUser = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginInputs = z.infer<typeof loginSchema>;

// Update endUser profile use existing by remove password
export const UpdateProfileSchema = registerSchema.omit({
  password: true,
  confirmPassword: true,
});

export type UpdateUserInput = z.infer<typeof UpdateProfileSchema>;
