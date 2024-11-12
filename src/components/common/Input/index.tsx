'use client';

// Libs
import { forwardRef } from 'react';
import {
  extendVariants,
  InputProps,
  Input as NextUIInput,
} from '@nextui-org/react';

const CustomInput = extendVariants(NextUIInput, {
  variants: {
    color: {
      primary: {
        inputWrapper: [
          'bg-gray-50 dark:bg-gray-600',
          'hover:data-[hover=true]:bg-gray-200/50 dark:hover:bg-gray-900',
          'focus-within:bg-gray-50 dark:focus-within:bg-gray-600',
          'group-data-[focus=true]:bg-gray-50 dark:group-data-[focus=true]:bg-gray-600',
        ],
        input: [
          'text-blue-800/70 dark:text-white/70',
          'placeholder:text-blue-800/40 dark:placeholder:text-white/40',
          'bg-transparent',
        ],
        label: [
          'group-data-[filled-within=true]:!text-blue-800 dark:group-data-[filled-within=true]:!text-white',
        ],
      },
      secondary: {
        inputWrapper: [
          'bg-gray-200/30 dark:bg-gray-600/30',
          'hover:bg-gray-200/50 dark:hover:bg-gray-600/80',
          'focus-within:bg-gray-200/30 dark:focus-within:bg-gray-600/30',
          'group-data-[focus=true]:bg-gray-200/30 dark:group-data-[focus=true]:bg-gray-600/30',
        ],
        input: [
          'text-blue-800/70 dark:text-white/70',
          'placeholder:text-blue-800/40 dark:placeholder:text-white/40',
        ],
        label:
          'group-data-[filled-within=true]:text-blue-800 dark:group-data-[filled-within=true]:text-white',
      },
    },
    size: {
      sm: {
        inputWrapper: 'h-[42px] px-5 pt-3 pb-3.75',
        input: 'text-xl',
      },
      md: {
        inputWrapper: 'h-12.5 p-3.75',
        input: 'text-md',
        base: 'data-[has-label=true]:mt-[29px]',
        label: 'font-medium text-xl top-5',
      },
    },
    radius: {
      sm: {
        inputWrapper: 'rounded-[5px]',
      },
      md: {
        inputWrapper: 'rounded-[10px]',
      },
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'md',
    radius: 'md',
    labelPlacement: 'outside',
    placeholder: ' ',
  },
});

const Input = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => (
  <CustomInput
    ref={ref}
    classNames={{
      inputWrapper:
        'group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-blue-500',
    }}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
