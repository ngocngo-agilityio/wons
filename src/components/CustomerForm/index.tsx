'use client';

import { memo, useMemo, useTransition } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

// Utils
import {
  clearErrorOnChange,
  customerFormSchema,
  formatPhoneNumberTyping,
  getDirtyState,
  isEnableSubmitButton,
} from '@/utils';

// Components
import {
  Button,
  Heading,
  Input,
  AvatarUpload,
  AddressInput,
} from '@/components';

// Models
import { ICustomer } from '@/models';

// icons
import { IoClose } from 'react-icons/io5';

const REQUIRED_FIELDS = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'gender',
  'job',
  'address',
  'avatar',
];
const genders = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
];

export interface ICustomerFormProps {
  isDisabledField?: boolean;
  previewData?: ICustomer | null;
  onCloseDrawer?: () => void;
  onAvatarChange: (file: File) => void;
  onSubmit: (data: ICustomer) => void;
}

const CustomerForm = ({
  isDisabledField = false,
  previewData,
  onAvatarChange,
  onSubmit,
  onCloseDrawer,
}: ICustomerFormProps) => {
  const {
    control,
    formState: { dirtyFields, errors, defaultValues, isValid },
    clearErrors,
    handleSubmit,
    watch,
    reset,
  } = useForm<Partial<ICustomer>>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData || {
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      job: '',
      address: '',
      avatar: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const dirtyItems = Object.keys(dirtyFields);

  const enableSubmit: boolean = useMemo(
    () => isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors),
    [dirtyItems, errors],
  );

  const requiredField = REQUIRED_FIELDS.filter((field) => field !== 'imageUrl');
  const allFieldsFilled = requiredField.every((field) => {
    const isDirty = dirtyItems.includes(field);
    const hasError = errors[field as keyof Partial<ICustomer>];
    return isDirty && !hasError;
  });

  const isDisableSubmit = previewData
    ? !(enableSubmit || !getDirtyState(defaultValues ?? {}, watch()))
    : !allFieldsFilled;

  const saveData = async (formData: Partial<ICustomer>) => {
    startTransition(async () => {
      await onSubmit(formData as ICustomer);
      reset();
    });
  };

  return (
    <form
      data-testid="customer-form"
      className="w-full max-w-2xl mx-auto"
      onSubmit={handleSubmit(saveData)}
    >
      <div className="flex items-center justify-between">
        <Heading title={previewData ? 'Update Customer' : 'Add Customer'} />
        <Button
          onClick={onCloseDrawer}
          className="bg-pink-50 dark:bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer px-0 "
          data-testid="close-button"
        >
          <IoClose size={20} />
        </Button>
      </div>

      <div className="flex justify-center mt-[39px]">
        <Controller
          control={control}
          name="avatar"
          render={({
            field: { onChange, value, name },
            fieldState: { error },
          }) => (
            <AvatarUpload
              aria-label="Avatar"
              value={value ?? ''}
              error={error?.message}
              onChange={(e) => {
                onChange(e);
                clearErrorOnChange(name, errors, clearErrors);
              }}
              onFileChange={onAvatarChange}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-[7px_0] mt-[30px]">
        <Controller
          name="firstName"
          control={control}
          render={({
            field: { name, onChange, ...rest },
            fieldState: { error },
          }) => (
            <Input
              label="First Name"
              classNames={{ base: 'h-[71px]' }}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isDisabledField}
              onChange={(e) => {
                onChange(e.target.value);

                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />

        {/* Username */}
        <Controller
          name="lastName"
          control={control}
          render={({
            field: { name, onChange, ...rest },
            fieldState: { error },
          }) => (
            <Input
              label="Last Name"
              classNames={{ base: 'h-[71px]' }}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isDisabledField}
              onChange={(e) => {
                onChange(e.target.value);

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
              isDisabled={isDisabledField}
              onChange={(e) => {
                onChange(e.target.value);

                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />

        {/* Password */}
        <Controller
          name="phone"
          control={control}
          render={({
            field: { name, onChange, value, ...rest },
            fieldState: { error },
          }) => (
            <Input
              label="Phone Number"
              classNames={{ base: 'h-[71px]' }}
              type="text"
              value={formatPhoneNumberTyping(value ?? '')}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isDisabledField}
              onChange={(e) => {
                onChange(formatPhoneNumberTyping(e.target.value));

                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />

        <Controller
          name="job"
          control={control}
          render={({
            field: { name, onChange, ...rest },
            fieldState: { error },
          }) => (
            <Input
              label="Job"
              classNames={{ base: 'h-[71px]' }}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isDisabledField}
              onChange={(e) => {
                onChange(e.target.value);

                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({
            field: { name, onChange, ...rest },
            fieldState: { error },
          }) => (
            <AddressInput
              isInvalid={!!error}
              errorMessage={error?.message}
              isDisabled={isDisabledField}
              className="flex-1"
              classNames={{ base: 'h-[71px]' }}
              onChange={(value) => {
                onChange(value);

                // Clear error message on change
                clearErrorOnChange(name, errors, clearErrors);
              }}
              label="Address"
              {...rest}
            />
          )}
        />

        <Controller
          name="gender"
          control={control}
          render={({
            field: { name, onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <div className="flex flex-col w-full h-[71px] mb-[21px]">
              <Select
                name={name}
                id="gender"
                defaultSelectedKeys={[value as string]}
                labelPlacement="outside"
                onClose={onBlur}
                placeholder=" "
                label="Gender"
                className={clsx('w-full rounded-md', {
                  'border-red-500': error,
                  'border-gray-300': !error,
                })}
                classNames={{
                  trigger: clsx(
                    'w-full py-[26px]',
                    error
                      ? 'bg-danger-50 hover:data-[hover=true]:bg-danger-200/50 focus:bg-danger-200/50 dark:hover:data-[hover=true]:bg-gray-600'
                      : 'bg-gray-50 dark:bg-gray-600 hover:data-[hover=true]:bg-gray-200/50 dark:hover:data-[hover=true]:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600',
                  ),
                  label:
                    'text-xl font-medium pb-1 !text-blue-800 dark:!text-white',
                }}
                isDisabled={isDisabledField}
                onChange={(e) => {
                  onChange(e.target.value);
                  clearErrorOnChange(name, errors, clearErrors);
                }}
                isInvalid={!!error}
                errorMessage={error?.message}
              >
                {genders.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
        />

        <Button
          type="submit"
          isLoading={isPending}
          isDisabled={isDisableSubmit || isPending || !isValid}
          size="lg"
          color="primary"
          className="w-full mt-[30px] text-xl font-medium cursor-pointer"
        >
          {previewData ? 'Update Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
};

export default memo(CustomerForm);
