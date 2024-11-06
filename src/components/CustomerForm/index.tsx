'use client';

import { memo, useCallback, useMemo, useTransition } from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  'avatar',
];
const genders = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
];

export interface ICustomerFormProps {
  isDisabledField?: boolean;
  onAvatarChange: (file: File) => void;
  onSubmit: (data: ICustomer) => void;
  previewData?: ICustomer | null;
  onCloseDrawer?: () => void;
}

const CustomerForm = ({
  isDisabledField = false,
  onAvatarChange,
  onSubmit,
  previewData = null,
  onCloseDrawer,
}: ICustomerFormProps) => {
  const {
    control,
    formState: { dirtyFields, errors, defaultValues },
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

  const saveData = useCallback(
    async (formData: Partial<ICustomer>) => {
      startTransition(async () => {
        await onSubmit(formData as ICustomer);
        reset();
      });
    },
    [onSubmit, reset],
  );

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
      <div className="flex justify-center mt-[21px]">
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
            className="mb-12"
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
            className="mb-12"
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
          field: { name, onChange, value },
          fieldState: { error },
        }) => (
          <div className="flex flex-col w-full h-[71px] mb-5">
            <Select
              name={name}
              id="gender"
              defaultSelectedKeys={[value as string]}
              labelPlacement="outside"
              placeholder=" "
              label="Gender"
              className={`w-full ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              classNames={{
                trigger: `w-full ${
                  error
                    ? 'bg-danger-50 hover:bg-danger-200/50 focus:bg-danger-200/50 dark:hover:bg-gray-600'
                    : 'bg-gray-50 dark:bg-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600'
                } py-[26px] mt-5`,
                label: 'text-xl font-medium pb-1',
              }}
              isDisabled={isDisabledField}
              onChange={(e) => {
                onChange(e.target.value);
                clearErrorOnChange(name, errors, clearErrors);
              }}
            >
              {genders.map((gender) => (
                <SelectItem key={gender.key} value={gender.key}>
                  {gender.label}
                </SelectItem>
              ))}
            </Select>

            {error && (
              <p className="text-red-500 text-xs mt-1">{error.message}</p>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        isLoading={isPending}
        isDisabled={isDisableSubmit || isPending}
        size="lg"
        color="primary"
        className="w-full mt-8 text-xl font-medium cursor-pointer"
      >
        {previewData ? 'Update Customer' : 'Add Customer'}
      </Button>
    </form>
  );
};

export default memo(CustomerForm);
