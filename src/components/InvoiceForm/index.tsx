'use client';

import { memo, useCallback, useMemo, useState, useTransition } from 'react';
import isEqual from 'react-fast-compare';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

// libs
import { Select, SelectItem } from '@nextui-org/react';

// Constants
import { INVOICE_STATUS, MESSAGES, ROUTES } from '@/constants';

// Models
import { ICustomer, IProduct, TInvoice, TInvoiceProduct } from '@/models';

// Utils
import {
  clearErrorOnChange,
  convertToCalendarDate,
  currentDate,
  formatDatePicker,
  getDirtyState,
  invoiceSchema,
  isEnableSubmitButton,
} from '@/utils';

// Types
import {
  StrapiModel,
  TInvoiceDetail,
  TInvoiceFormData,
  TInvoiceProductTable,
  InvoiceStatus,
} from '@/types';

// Components
import {
  AddressInput,
  AvatarUpload,
  Button,
  DatePicker,
  Input,
  InvoiceProductTable,
  LoadingIndicator,
} from '@/components';

// api
import { uploadImage } from '@/api/image';

// Hooks
import { useToast } from '@/hooks';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';

const REQUIRED_FIELDS = ['date', 'customerId', 'email', 'address', 'status'];

interface InvoiceFormProps {
  invoiceId: string;
  onSubmit: (
    data: Partial<TInvoice>,
    products: TInvoiceProduct<IProduct & { id: number }>[],
  ) => Promise<{
    error?: string;
    data?: StrapiModel<TInvoiceDetail>;
  }>;
  isEdit?: boolean;
  products: (IProduct & { id: number })[];
  customers: (ICustomer & { id: number })[];
  previewData?: (TInvoice & { id: number }) | null;
  previewInvoiceProducts?: TInvoiceProductTable[];
}

const InvoiceForm = ({
  invoiceId,
  products = [],
  customers = [],
  isEdit = false,
  previewData = null,
  previewInvoiceProducts,
  onSubmit,
}: InvoiceFormProps) => {
  const [productsValues, setProductsValues] = useState<TInvoiceProductTable[]>(
    previewInvoiceProducts ?? [],
  );
  const [errorProducts, setErrorProducts] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    control,
    formState: { dirtyFields, errors, defaultValues },
    clearErrors,
    watch,
    handleSubmit,
  } = useForm<TInvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData ?? {
      imageUrl: '',
      invoiceId: '',
      date: '',
      customerId: '',
      email: '',
      address: '',
      status: InvoiceStatus.Default,
    },
  });

  const optionsCustomers = customers.map((customer) => ({
    value: customer.id.toString(),
    label: customer.lastName,
  }));

  // Checking to disable/enable submit button
  const dirtyItems = Object.keys(dirtyFields);

  const enableSubmit: boolean = useMemo(
    () => isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors),
    [dirtyItems, errors],
  );
  const requiredField = REQUIRED_FIELDS.filter((field) => field !== 'imageUrl');

  const allFieldsFilled = requiredField.every((field) => {
    const isDirty = dirtyItems.includes(field);
    const hasError = errors[field as keyof Partial<TInvoiceFormData>];
    return isDirty && !hasError;
  });

  const isDisableSubmit = previewData
    ? !(enableSubmit || !getDirtyState(defaultValues ?? {}, watch()))
    : !allFieldsFilled;

  const hasEmptyField =
    !productsValues.length ||
    productsValues.some((obj) => Object.values(obj).some((value) => !value));

  const handleSubmitButton = async (formData: TInvoiceFormData) => {
    if (hasEmptyField) {
      console.log('huy dao=======================');

      return setErrorProducts(MESSAGES.ERROR.FIELD_REQUIRED);
    }

    if (isAvatarDirty && avatarFile) {
      const imageUrl = await uploadImage(avatarFile);

      if (imageUrl?.downloadURL) {
        formData.imageUrl = imageUrl.downloadURL;
      } else {
        return { error: imageUrl.error };
      }
    }

    startTransition(async () => {
      const { error, data } = await onSubmit(
        {
          ...formData,
          customerId: formData.customerId.toString(),
          invoiceId,
        },
        productsValues,
      );

      if (error) {
        showToast({
          description: error,
          status: MESSAGES.STATUS.ERROR,
        });
        return;
      }

      data && router.push(`${ROUTES.INVOICE}/${data.id}`);

      showToast({
        description: previewData
          ? MESSAGES.SUCCESS.UPDATE_INVOICE
          : MESSAGES.SUCCESS.CREATE_INVOICE,
        status: MESSAGES.STATUS.SUCCESS,
      });
    });
  };

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  return (
    <>
      {isPending && <LoadingIndicator />}
      <form
        data-testid="invoice-form"
        className="w-full max-w-[700px] justify-center"
        onSubmit={handleSubmit(handleSubmitButton)}
      >
        {isEdit && (
          <div className="flex justify-center sm:mt-[21px]">
            <Controller
              control={control}
              name="imageUrl"
              render={({
                field: { onChange, value, name },
                fieldState: { error },
              }) => (
                <AvatarUpload
                  value={value}
                  error={error?.message}
                  onChange={(e) => {
                    onChange(e);

                    // Clear error message on change
                    clearErrorOnChange(name, errors, clearErrors);
                  }}
                  onFileChange={handleAvatarChange}
                />
              )}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:gap-[30px] sm:mt-[30px]">
          {/* Invoice Id*/}
          <Controller
            name="invoiceId"
            control={control}
            render={() => (
              <Input
                isDisabled
                label="Invoice Id"
                classNames={{ base: 'h-[74px]' }}
                value={`#${invoiceId}`}
              />
            )}
          />

          {/* Date */}
          <Controller
            name="date"
            control={control}
            render={({
              field: { onChange, name, value },
              fieldState: { error },
            }) => {
              const handleChange = (
                date: CalendarDate | CalendarDateTime | ZonedDateTime | null,
              ): void => {
                if (!date) {
                  return onChange?.('');
                }

                onChange?.(formatDatePicker(date));
              };

              return (
                <DatePicker
                  defaultValue={convertToCalendarDate(
                    value as unknown as string,
                  )}
                  onChange={(value) => {
                    handleChange(value);

                    // Clear error message on change
                    clearErrorOnChange(name, errors, clearErrors);
                  }}
                  minValue={currentDate}
                  label="Date"
                  isInvalid={!!error}
                  className="mt-1"
                  errorMessage={error?.message}
                />
              );
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row mt-8 sm:mt-0 gap-[30px]">
          {/* Customer */}
          <Controller
            name="customerId"
            control={control}
            render={({
              field: { name, onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <div className="flex flex-col w-full h-[71px] mb-12">
                <Select
                  name={name}
                  id="customerId"
                  defaultSelectedKeys={[value]}
                  labelPlacement="outside"
                  onClose={onBlur}
                  placeholder=" "
                  label="Name"
                  className={clsx('w-full rounded-md', {
                    'border-red-500': error,
                    'border-gray-300': !error,
                  })}
                  classNames={{
                    trigger: clsx(
                      'w-full py-[26px] mt-5',
                      error
                        ? 'bg-danger-50 hover:bg-danger-200/50 focus:bg-danger-200/50 dark:hover:bg-gray-600'
                        : 'bg-gray-50 dark:bg-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600',
                    ),
                    label:
                      'text-xl font-medium pb-1 !text-blue-800 dark:!text-white',
                  }}
                  onChange={(e) => {
                    onChange(e.target.value);
                    clearErrorOnChange(name, errors, clearErrors);
                  }}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                >
                  {optionsCustomers.map((customer) => (
                    <SelectItem key={customer.value} value={customer.value}>
                      {customer.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
          />

          {/* Status */}
          <Controller
            name="status"
            control={control}
            render={({
              field: { name, onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <div className="flex flex-col w-full h-[71px] mb-12">
                <Select
                  name={name}
                  id="status"
                  defaultSelectedKeys={[value as string]}
                  labelPlacement="outside"
                  onClose={onBlur}
                  placeholder=" "
                  label="Status"
                  className={clsx('w-full rounded-md', {
                    'border-red-500': error,
                    'border-gray-300': !error,
                  })}
                  classNames={{
                    trigger: clsx(
                      'w-full py-[26px] mt-5',
                      error
                        ? 'bg-danger-50 hover:bg-danger-200/50 focus:bg-danger-200/50 dark:hover:bg-gray-600'
                        : 'bg-gray-50 dark:bg-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600',
                    ),
                    label:
                      'text-xl font-medium pb-1 !text-blue-800 dark:!text-white',
                  }}
                  onChange={(e) => {
                    onChange(e.target.value);
                    clearErrorOnChange(name, errors, clearErrors);
                  }}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                >
                  {INVOICE_STATUS.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-[30px] mt-[30px]">
          {/*Email*/}
          <Controller
            name="email"
            control={control}
            render={({
              field: { name, onChange, ...rest },
              fieldState: { error },
            }) => (
              <Input
                className="flex-1"
                label="Email"
                classNames={{ base: 'h-[74px]' }}
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

          {/* Address */}
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
        </div>

        <div className="mt-[30px] sm:mt-[17px]">
          <InvoiceProductTable
            products={products}
            productsValues={productsValues}
            errorProducts={errorProducts}
            setErrorProducts={setErrorProducts}
            setProductsValues={setProductsValues}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-[30px]">
          <Button
            as={Link}
            href={ROUTES.INVOICE}
            size="lg"
            color="secondary"
            className="w-full mt-10 dark:text-purple-450"
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isDisabled={isDisableSubmit || hasEmptyField}
            isLoading={isPending}
            size="lg"
            color="primary"
            className="w-full mt-[20px] sm:mt-10"
          >
            {isEdit ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default memo(InvoiceForm, isEqual);
