'use client';

import { memo, useMemo, useTransition } from 'react';
import { Select, SelectItem, Textarea } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import isEqual from 'react-fast-compare';

// Constants
import { BRANDS, MESSAGES } from '@/constants';

// Utils
import {
  clearErrorOnChange,
  formatPriceTyping,
  getDirtyState,
  isEnableSubmitButton,
  productFormSchema,
} from '@/utils';

// Components
import {
  Button,
  Heading,
  Input,
  AvatarUpload,
  Checkbox,
  Text,
} from '@/components';

// Models
import { IProductDetail } from '@/models';

// Icons
import { GrPrevious } from 'react-icons/gr';

const REQUIRED_FIELDS = ['title', 'brand', 'imageUrl', 'description', 'price'];

export interface IProductFormProps {
  isDisabledField?: boolean;
  previewData?: IProductDetail | null;
  onAvatarChange: (file: File) => void;
  onSubmit: (data: IProductDetail) => void;
  onCloseDrawer?: () => void;
}

const ProductForm = ({
  isDisabledField = false,
  previewData,
  onAvatarChange,
  onSubmit,
  onCloseDrawer,
}: IProductFormProps) => {
  const {
    control,
    formState: { dirtyFields, errors, defaultValues, isValid },
    clearErrors,
    handleSubmit,
    watch,
    setError,
  } = useForm<Partial<IProductDetail>>({
    resolver: zodResolver(productFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData || {
      title: '',
      brand: '',
      imageUrl: '',
      price: 0,
      description: '',
      negotiable: false,
    },
  });
  const { FIELD_REQUIRED } = MESSAGES.ERROR;
  const [isPending, startTransition] = useTransition();

  // Checking to disable/enable submit button
  const dirtyItems = Object.keys(dirtyFields);

  const enableSubmit: boolean = useMemo(
    () => isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors),
    [dirtyItems, errors],
  );

  const requiredField = REQUIRED_FIELDS.filter((field) => field !== 'imageUrl');
  const allFieldsFilled = requiredField.every((field) => {
    const isDirty = dirtyItems.includes(field);
    const hasError = errors[field as keyof Partial<IProductDetail>];
    return isDirty && !hasError;
  });

  const isDisableSubmit = previewData
    ? !(enableSubmit || !getDirtyState(defaultValues ?? {}, watch()))
    : !allFieldsFilled;

  const saveData = async (formData: Partial<IProductDetail>) => {
    if (!formData.imageUrl) {
      setError('imageUrl', {
        type: 'manual',
        message: FIELD_REQUIRED,
      });

      return;
    }

    startTransition(async () => {
      await onSubmit(formData as IProductDetail);
    });
  };

  return (
    <form
      className="w-full max-w-2xl mx-auto mt-20"
      onSubmit={handleSubmit(saveData)}
    >
      <section className="flex items-center">
        <Button
          data-testid="close-product-form"
          onClick={onCloseDrawer}
          className="p-2 bg-transparent dark:bg-transparent text-gray-200 dark:text-gray-300 hover:bg-transparent dark:hover:bg-transparent"
        >
          <GrPrevious size={20} />
        </Button>
        <Heading
          title={previewData ? 'Update Product' : 'Add a New Product'}
          className="text-center whitespace-nowrap w-full"
        />
      </section>

      <div className="flex justify-center mt-[39px]">
        <Controller
          control={control}
          name="imageUrl"
          render={({
            field: { onChange, value, name },
            fieldState: { error },
          }) => (
            <AvatarUpload
              value={value ?? ''}
              error={error?.message}
              onChange={(e) => {
                onChange(e);
                clearErrors(name);
              }}
              onFileChange={onAvatarChange}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-[7px_0] mt-[30px]">
        <Controller
          name="title"
          control={control}
          render={({
            field: { name, onChange, ...rest },
            fieldState: { error },
          }) => (
            <Input
              label="Product Name"
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
          name="brand"
          control={control}
          render={({
            field: { name, onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <div className="flex flex-col w-full h-[100px]">
              <Select
                name={name}
                id="brand"
                defaultSelectedKeys={[value as string]}
                labelPlacement="outside"
                placeholder=" "
                label="Brand"
                className={`w-full ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-md`}
                classNames={{
                  trigger: `w-full ${
                    error
                      ? 'bg-danger-50 hover:bg-danger-200/50 focus:bg-danger-200/50 dark:hover:bg-gray-600'
                      : 'bg-gray-50 dark:bg-gray-600 hover:data-[hover=true]:bg-gray-200/50 dark:hover:data-[hover=true]:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600'
                  } py-[26px]`,
                  label:
                    'text-xl font-medium pb-1 !text-blue-800 dark:!text-white',
                }}
                isDisabled={isDisabledField}
                onChange={(e) => {
                  onChange(e.target.value);
                  clearErrorOnChange(name, errors, clearErrors);
                }}
                onClose={onBlur}
                isInvalid={!!error}
                errorMessage={error?.message}
              >
                {BRANDS.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
        />

        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-5">
            <Controller
              name="price"
              control={control}
              render={({
                field: { name, onChange, value, ...rest },
                fieldState: { error },
              }) => {
                const formattedValue = formatPriceTyping(
                  value ? String(value) : '',
                );

                return (
                  <Input
                    label="Price"
                    value={formattedValue}
                    classNames={{ base: 'h-[71px]' }}
                    isInvalid={!!error}
                    errorMessage={
                      error?.message === 'Required'
                        ? FIELD_REQUIRED
                        : error?.message
                    }
                    isDisabled={isDisabledField}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\$|,/g, '');
                      onChange(rawValue);
                      clearErrorOnChange(name, errors, clearErrors);
                    }}
                    {...rest}
                  />
                );
              }}
            />
          </div>

          {/* Negotiable Checkbox */}
          <div className="col-span-5 flex items-center ml-4">
            <Controller
              name="negotiable"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <>
                  <Checkbox
                    aria-label="Negotiable"
                    value={value ? 'true' : 'false'}
                    onChange={onChange}
                    {...rest}
                    size="lg"
                  />
                  <Text
                    text="Negotiable"
                    className="ml-2 color-blue.900 leading-[18.51px]"
                  />
                </>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col h-[125px]">
          <label className="text-xl font-medium pb-2">Descriptions</label>
          <Controller
            name="description"
            control={control}
            render={({
              field: { name, onChange, ...rest },
              fieldState: { error },
            }) => (
              <Textarea
                classNames={{
                  input:
                    'group-data-[has-value=true]:text-blue-800/70 dark:group-data-[has-value=true]:text-white/70',
                  inputWrapper: [
                    'bg-gray-50 dark:bg-gray-600',
                    'hover:data-[hover:true]:bg-gray-200/50 dark:hover:data-[hover:true]:bg-gray-900',
                    'focus-within:bg-gray-50 dark:focus-within:bg-gray-600',
                    'group-data-[focus=true]:bg-gray-50 dark:group-data-[focus=true]:bg-gray-600',
                  ],
                }}
                rows={4}
                disableAutosize
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
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isPending}
        isDisabled={isDisableSubmit || isPending || !isValid}
        size="lg"
        color="primary"
        className="w-full mt-[45px] text-xl font-medium cursor-pointer"
      >
        Save Product
      </Button>
    </form>
  );
};

export default memo(ProductForm, isEqual);
