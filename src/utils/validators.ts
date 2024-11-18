import { z } from 'zod';

// Constants
import { MESSAGES, REGEX } from '@/constants';

// Utils
import { clearPhoneNumberFormat } from './format';

const {
  FIELD_REQUIRED,
  FIELD_INVALID,
  INVALID_PHONE,
  EMAIL_INVALID,
  GENERAL_INVALID_PASSWORD,
  INVALID_PASSWORD,
} = MESSAGES.ERROR;

/**
 * @param requiredFields [] The required fields on form
 * @param dirtyFields [] The fields, which the users touched and fill data on
 * @param errors {} The errors fields
 * NOTE: If the user touched and fill data for the fields, which defined on array requiredFields and without errors message
 *  ==> The button should enable.
 * When the button enable AND user focusing on the last element
 * the UX: hit `enter` on the last field to submit form should work
 */
export const isEnableSubmitButton = (
  requiredFields: string[],
  dirtyFields: string[],
  errors: Record<string, unknown>,
): boolean => {
  const isMatchAllRequiredFields: boolean = requiredFields.every((field) =>
    dirtyFields.includes(field),
  );

  return isMatchAllRequiredFields && errors && !Object.keys(errors).length;
};

/**
 * Function get dirty state
 */
export const getDirtyState = <T extends object>(
  baseObject: T,
  targetObject: T,
) => {
  const baseKeys = Object.keys(baseObject) as Array<keyof T>;
  const targetKeys = Object.keys(targetObject) as Array<keyof T>;

  if (baseKeys.length !== targetKeys.length) return false;

  for (const key of baseKeys) {
    if (!Object.prototype.hasOwnProperty.call(targetObject, key)) return false;

    // Trim the values before comparing
    const baseValue = String(baseObject[key]).trim();
    const targetValue = String(targetObject[key]).trim();

    if (baseValue !== targetValue) return false;
  }

  return true;
};

// Zod schema validation for CalendarEventForm
export const eventSchema = z.object({
  title: z.string().nonempty(FIELD_REQUIRED),
  location: z.string(),
  people: z.string(),
});

// Zod schema validation for CalendarTaskForm
export const taskSchema = z.object({
  title: z.string().nonempty(FIELD_REQUIRED),
  descriptions: z.string().nonempty(FIELD_REQUIRED),
});

// Zod schema validation for CustomerForm
export const customerFormSchema = z.object({
  firstName: z.string().nonempty(FIELD_REQUIRED),
  lastName: z.string().nonempty(FIELD_REQUIRED),
  email: z
    .string()
    .nonempty(FIELD_REQUIRED)
    .email(FIELD_INVALID('Email Address')),
  phone: z
    .string()
    .nonempty(FIELD_REQUIRED)
    .transform((value) => clearPhoneNumberFormat(value))
    .refine((value) => REGEX.PHONE.test(value), INVALID_PHONE),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: FIELD_REQUIRED }),
  }),
  avatar: z.string().nonempty(FIELD_REQUIRED),
  address: z.string().nonempty(FIELD_REQUIRED),
  job: z.string().nonempty(FIELD_REQUIRED),
});

// Zod schema validation for InvoiceForm
export const invoiceSchema = z.object({
  invoiceId: z.string(),
  customerId: z.string().nonempty(FIELD_REQUIRED),
  status: z.string().nonempty(FIELD_REQUIRED),
  address: z.string().nonempty(FIELD_REQUIRED),
  date: z.any(),
  email: z.string().nonempty(FIELD_REQUIRED).email(FIELD_INVALID('Email')),
  imageUrl: z.string(),
});

// Zod schema validation for ProductForm
export const productFormSchema = z.object({
  title: z.string().nonempty(FIELD_REQUIRED),
  brand: z.enum(['apple', 'samsung', 'huawei', 'xiaomi', 'oppo', 'google'], {
    errorMap: () => ({ message: FIELD_REQUIRED }),
  }),
  imageUrl: z.string().nonempty({
    message: FIELD_REQUIRED,
  }),
  price: z.preprocess(
    (value) => {
      if (typeof value === 'string' && value.trim() === '') return undefined;

      if (typeof value === 'string') {
        const numericValue = value.replace(REGEX.PRICE_PRODUCT, '');
        return parseFloat(numericValue);
      }
      return value;
    },
    z
      .number({ invalid_type_error: FIELD_INVALID('Price') })
      .min(0, FIELD_INVALID('Price'))
      .refine((val) => !!val, { message: FIELD_REQUIRED })
      .refine((val) => String(Math.floor(val)).length <= 9, {
        message: FIELD_INVALID('Price cannot exceed 7 digits'),
      }),
  ),
  description: z
    .string()
    .nonempty(FIELD_REQUIRED)
    .max(10000, FIELD_INVALID('Description')),
  negotiable: z.boolean(),
});

// Zod schema validation for SignInForm
export const signInSchema = z.object({
  identifier: z.string().nonempty(FIELD_REQUIRED).email(EMAIL_INVALID),
  password: z
    .string()
    .nonempty(FIELD_REQUIRED)
    .regex(REGEX.PASSWORD, GENERAL_INVALID_PASSWORD),
});

// Zod schema validation for SignUpForm
export const signUpSchema = z.object({
  fullName: z.string().nonempty(FIELD_REQUIRED),
  username: z.string().nonempty(FIELD_REQUIRED),
  email: z.string().nonempty(FIELD_REQUIRED).email(EMAIL_INVALID),
  password: z
    .string()
    .nonempty(FIELD_REQUIRED)
    .regex(REGEX.PASSWORD, INVALID_PASSWORD),
});

// Zod schema validation for TaskForm
export const taskFormSchema = z.object({
  title: z.string().nonempty(FIELD_REQUIRED),
  label: z.enum(['todo', 'inProgress', 'inReview', 'done'], {
    errorMap: () => ({ message: FIELD_REQUIRED }),
  }),
  level: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: FIELD_REQUIRED }),
  }),
  assignees: z.string().nonempty(FIELD_REQUIRED),
  description: z
    .string()
    .nonempty(FIELD_REQUIRED)
    .max(10000, FIELD_INVALID('Description')),
});

// Zod schema validation for UserDetailForm
export const userDetailFormSchema = z.object({
  avatar: z.string().nonempty(FIELD_REQUIRED),
  username: z.string().nonempty(FIELD_REQUIRED),
  role: z.string().nonempty(FIELD_REQUIRED),
  fullName: z.string().nonempty(FIELD_REQUIRED),
  email: z.string().nonempty(FIELD_REQUIRED).email(FIELD_INVALID('Email')),
});
