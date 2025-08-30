import { z } from 'zod';

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Name cannot be empty' }),
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password should be atlest 8 character long' }),
  phone: z.string().regex(phoneRegex, 'Invalid Number!'),
});

const loginSchema = registerSchema.omit({ phone: true, name: true });

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password should be atlest 8 character long' }),
  confirmNewPassword: z.string().min(8, { message: 'Password should be atlest 8 character long' }),
  resetToken: z.string({ message: 'token is invalid' }),
});

export { registerSchema, loginSchema, resetPasswordSchema };
