'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// Constants
import { ERROR_MESSAGES, IMAGES, REGEX } from '@/constants';

// Utils
import { clearErrorOnChange, isEnableSubmitButton } from '@/utils';

// Types
import { ISignUpFormData } from '@/types';

// Components
import { Button, Input, Text, Checkbox } from '@/components';

// Zod schema for validation
const signUpSchema = z.object({
  fullName: z.string().nonempty(ERROR_MESSAGES.FIELD_REQUIRED),
  username: z.string().nonempty(ERROR_MESSAGES.FIELD_REQUIRED),
  email: z
    .string()
    .nonempty(ERROR_MESSAGES.FIELD_REQUIRED)
    .email(ERROR_MESSAGES.FIELD_INVALID('Email Address')),
  password: z
    .string()
    .nonempty(ERROR_MESSAGES.FIELD_REQUIRED)
    .regex(REGEX.PASSWORD, ERROR_MESSAGES.INVALID_PASSWORD),
});

const REQUIRED_FIELDS = ['fullName', 'username', 'email', 'password'];

export interface ISignUpFormProps {
  isPending?: boolean;
  onSubmit: (data: ISignUpFormData) => void;
}

const SignUpForm = ({ isPending = false, onSubmit }: ISignUpFormProps) => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const {
    control,
    formState: { dirtyFields, errors, isSubmitting },
    clearErrors,
    handleSubmit,
  } = useForm<ISignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      avatar: IMAGES.AVATAR_DEFAULT,
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  // Checking to disable/enable submit button
  const dirtyItems = Object.keys(dirtyFields);
  const isEnableSubmit =
    isChecked && isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors);

  const handleToggleVisiblePassword = useCallback(
    () => setIsShowPassword(!isShowPassword),
    [isShowPassword],
  );

  const handleCheckBoxChange = useCallback(
    () => setIsChecked(!isChecked),
    [isChecked],
  );

  const handleSignUp = (formData: ISignUpFormData) =>
    onSubmit({ ...formData, avatar: IMAGES.AVATAR_DEFAULT });

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      {/* Full Name */}
      <Controller
        name="fullName"
        control={control}
        render={({
          field: { name, onChange, ...rest },
          fieldState: { error },
        }) => (
          <Input
            label="Full Name"
            classNames={{ base: 'h-[71px]' }}
            isInvalid={!!error}
            errorMessage={error?.message}
            onChange={(e) => {
              onChange(e.target.value);

              // Clear error message on change
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={control}
        render={({
          field: { name, onChange, ...rest },
          fieldState: { error },
        }) => (
          <Input
            label="Email Address"
            classNames={{ base: 'h-[71px]' }}
            type="email"
            isInvalid={!!error}
            errorMessage={error?.message}
            onChange={(e) => {
              onChange(e.target.value);

              // Clear error message on change
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      {/* Username */}
      <Controller
        name="username"
        control={control}
        render={({
          field: { name, onChange, ...rest },
          fieldState: { error },
        }) => (
          <Input
            label="Username"
            classNames={{ base: 'h-[71px]' }}
            isInvalid={!!error}
            errorMessage={error?.message}
            onChange={(e) => {
              onChange(e.target.value);

              // Clear error message on change
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({
          field: { name, onChange, ...rest },
          fieldState: { error },
        }) => (
          <Input
            label="Password"
            type={isShowPassword ? 'text' : 'password'}
            endContent={
              isShowPassword ? (
                <IoMdEyeOff
                  className="w-5 h-5 cursor-pointer text-blue-800/50 dark:text-white/50"
                  onClick={handleToggleVisiblePassword}
                />
              ) : (
                <IoMdEye
                  data-testid="show-password"
                  className="w-5 h-5 cursor-pointer text-blue-800/50 dark:text-white/50"
                  onClick={handleToggleVisiblePassword}
                />
              )
            }
            isInvalid={!!error}
            errorMessage={error?.message}
            onChange={(e) => {
              onChange(e.target.value);

              // Clear error message on change
              clearErrorOnChange(name, errors, clearErrors);
            }}
            {...rest}
          />
        )}
      />

      {/* Policy */}
      <div className="flex gap-0.5 items-start mt-6.25">
        <Checkbox
          onChange={handleCheckBoxChange}
          classNames={{ wrapper: 'mt-1' }}
          data-testid="policy"
        />

        <div>
          <Text
            text="By creating an account you agree to the"
            size="xl"
            className="color-blue.900 font-medium inline"
          />
          &nbsp;
          <Link href="#">
            <Text
              text="terms of use"
              size="xl"
              className="!text-blue-500 dark:!text-purple-600 font-medium inline hover:underline"
            />
          </Link>
          &nbsp;
          <Text
            text="and our"
            size="xl"
            className="color-blue-900 font-medium inline"
          />
          &nbsp;
          <Link href="#">
            <Text
              text="privacy policy."
              size="xl"
              className="!text-blue-500 dark:!text-purple-600 font-medium inline hover:underline"
            />
          </Link>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        isDisabled={!isEnableSubmit || isPending || isSubmitting}
        size="lg"
        color="primary"
        className="w-full mt-8 text-xl font-medium"
      >
        Create account
      </Button>

      <div className="flex justify-center items-center mt-7.5">
        <Text
          text="Already have an account?"
          size="xl"
          className="color-blue-900 font-medium inline"
        />
        &nbsp;
        <Link href="/sign-in">
          <Text
            text="Login"
            size="xl"
            className="!text-blue-500 dark:!text-purple-600 font-medium inline hover:underline"
          />
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
