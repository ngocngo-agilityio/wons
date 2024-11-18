'use client';

import { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';

// Libraries
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Utils
import {
  clearErrorOnChange,
  isEnableSubmitButton,
  getDirtyState,
  userDetailFormSchema,
} from '@/utils';

// Components
import { Input, AvatarUpload, Button } from '@/components';

// Constants
import { MESSAGES } from '@/constants';

// Types
import { IUserFormData } from '@/types';

interface UserDetailFormProps {
  user: IUserFormData;
  onAvatarChange: (file: File) => void;
  onSubmit: (formData: IUserFormData) => Promise<void>;
  onCancel: () => void;
}

const REQUIRED_FIELDS = ['fullName', 'email'];

const UserDetailForm = ({
  user,
  onAvatarChange,
  onSubmit,
  onCancel,
}: UserDetailFormProps) => {
  // Define config and props for useForm
  const {
    control,
    formState: { dirtyFields, errors, defaultValues, isSubmitting, isValid },
    clearErrors,
    handleSubmit,
    watch,
  } = useForm<IUserFormData>({
    resolver: zodResolver(userDetailFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: user,
  });

  const dirtyItems = Object.keys(dirtyFields);

  const enableSubmit: boolean = useMemo(
    () => isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors),
    [dirtyItems, errors],
  );

  const isDisableSubmit = !(
    enableSubmit || !getDirtyState(defaultValues ?? {}, watch())
  );

  const handleFormSubmit = async (formData: IUserFormData) => {
    await onSubmit(formData);

    onCancel();
  };

  return (
    <form
      className="p-[0_30px_0] w-full"
      onSubmit={handleSubmit(handleFormSubmit)}
      data-testid="user-detail-form"
    >
      <div className="m-[30px_0_0] grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        <Controller
          control={control}
          name="avatar"
          rules={{
            required: MESSAGES.ERROR.FIELD_REQUIRED,
          }}
          render={({
            field: { onChange, value, name },
            fieldState: { error },
          }) => (
            <AvatarUpload
              additionalClass="md:justify-self-start"
              isRequired={false}
              value={value ?? ''}
              error={error?.message}
              isDisabled={isSubmitting}
              onChange={(e) => {
                onChange(e);

                // Clear error message on change
                clearErrorOnChange(name, errors, clearErrors);
              }}
              onFileChange={onAvatarChange}
            />
          )}
        />

        <div className="flex gap-[0_15px] items-center justify-end row-start-7 row-end--1 md:row-start-auto  md:row-end-auto">
          <Button
            className="min-w-[93px] h-fit bg-white font-normal dark:bg-transparent text-center text-blue-500 dark:text-white/70 border-[1px] border-[rgba(58, 54, 219, 0.1)] py-[10px] rounded-[10px] font-DM-Sans text-[15px] font-normal leading-normal"
            type="button"
            onClick={onCancel}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            className="min-w-[93px] h-fit text-[15px] font-medium py-[10px] px-[25px]"
            type="submit"
            isLoading={isSubmitting}
            color="primary"
            isDisabled={isDisableSubmit || isSubmitting || !isValid}
          >
            Save
          </Button>
        </div>

        <Controller
          name="username"
          control={control}
          render={({ field: { value } }) => (
            <Input isDisabled label="User Name" value={value} />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field: { value } }) => (
            <Input isDisabled label="Role" value={value} />
          )}
        />

        <Controller
          name="fullName"
          control={control}
          render={({
            field: { onChange, name, ...rest },
            fieldState: { error },
          }) => (
            <Input
              classNames={{
                inputWrapper: 'bg-gray-200/30',
              }}
              label="Full Name"
              type="text"
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isSubmitting}
              onChange={(e) => {
                onChange(e.target.value);

                // Clear error message on change
                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({
            field: { onChange, name, ...rest },
            fieldState: { error },
          }) => (
            <Input
              classNames={{
                inputWrapper: 'bg-gray-200/30',
              }}
              label="Email"
              type="email"
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isSubmitting}
              onChange={(e) => {
                onChange(e.target.value);

                // Clear error message on change
                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />
      </div>
    </form>
  );
};

export default memo(UserDetailForm, isEqual);
