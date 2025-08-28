import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Name cannot be empty' }),
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(8, {message: 'Password should be atlest 8 character long'}),
  phone: z.string().min(10, { message: "You must be at least 18 years old" }),
});

const loginSchema = registerSchema.omit({ phone: true, name: true });


export {
    registerSchema,
    loginSchema
}