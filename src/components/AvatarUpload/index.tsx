'use client';

import { ChangeEvent, memo, useCallback, useState } from 'react';

// icons
import { IoCamera } from 'react-icons/io5';

import { ImageFallback, Input } from '@/components';

// constants
import { MAX_SIZE, MESSAGES, REGEX } from '@/constants';

export interface TUpdateProfileProps {
  isRequired?: boolean;
  value: string;
  error?: string;
  isDisabled?: boolean;
  additionalClass?: string;
  onFileChange: (file: File) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload = ({
  value,
  error = '',
  isDisabled = false,
  additionalClass = '',
  isRequired = true,
  onChange,
  onFileChange,
}: TUpdateProfileProps) => {
  const [previewURL, setPreviewURL] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(error);

  const { FIELD_REQUIRED, UPLOAD_IMAGE, UPLOAD_IMAGE_SIZE } = MESSAGES.ERROR;

  const handleFocusBack = useCallback(() => {
    if (isRequired && !value) {
      setErrorMessage(previewURL ? '' : FIELD_REQUIRED);
      window.removeEventListener('focus', handleFocusBack);
    }
  }, [isRequired, previewURL, value]);

  const handleClickInput = useCallback(() => {
    if (isRequired && !value) {
      window.addEventListener('focus', handleFocusBack);
    }
  }, [handleFocusBack, isRequired, value]);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!REGEX.IMG.test(file.name)) {
      const error = UPLOAD_IMAGE;
      setErrorMessage(error);

      return;
    }

    if (file.size > MAX_SIZE) {
      const error = UPLOAD_IMAGE_SIZE;
      setErrorMessage(error);

      return;
    }

    setErrorMessage('');

    if (previewURL) {
      URL.revokeObjectURL(previewURL);
      setPreviewURL('');
    }

    const previewImage = URL.createObjectURL(file);
    setPreviewURL(previewImage);
    if (isRequired && !value) {
      window.removeEventListener('focus', handleFocusBack);
    }

    onFileChange(file);
  };

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangeFile(e);
    onChange(e);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center ${additionalClass}`}
    >
      <label
        htmlFor="file"
        className="cursor-pointer hover:scale-110 transition-transform"
      >
        {previewURL || value ? (
          <div className="relative w-32 h-32">
            <ImageFallback
              fill
              src={previewURL || value}
              alt="Avatar"
              className="rounded-full object-cover"
              data-testid="avatar-preview"
              placeholder={null}
              blurDataURL=""
            />
          </div>
        ) : (
          <div className="rounded-full w-32 h-32 bg-gray-50 dark:bg-gray-600 flex justify-center items-center">
            <IoCamera
              data-testid="avatar-upload-icon"
              size={32}
              className="text-blue-800/70 dark:text-white/70"
            />
          </div>
        )}
      </label>

      <Input
        aria-label="Upload Avatar"
        type="file"
        id="file"
        className="hidden"
        accept="image/*"
        onChange={handleOnchange}
        isInvalid={!errorMessage}
        errorMessage={errorMessage}
        isDisabled={isDisabled}
        data-testid="avatar-upload"
        onClick={handleClickInput}
      />

      {(errorMessage || error) && (
        <p className="text-red-500 text-md mt-2 z-100">
          {errorMessage || error}
        </p>
      )}
    </div>
  );
};

export default memo(AvatarUpload);
