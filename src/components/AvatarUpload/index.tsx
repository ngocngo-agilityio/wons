'use client';

import { ChangeEvent, memo, useCallback, useState } from 'react';

// icons
import { IoCamera } from 'react-icons/io5';

import { ImageFallback, Input } from '@/components';

// constants
import { MAX_SIZE, MESSAGES, REGEX } from '@/constants';

export type TUpdateProfileProps = {
  onFileChange: (file: File) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error?: string;
  isDisabled?: boolean;
  additionalClass?: string;
};

const AvatarUpload = ({
  value,
  error = '',
  onChange,
  onFileChange,
  isDisabled = false,
  additionalClass = '',
}: TUpdateProfileProps) => {
  const [previewURL, setPreviewURL] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(error);

  const handleChangeFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = (e.target.files && e.target.files[0]) as File;

      if (!file) {
        return;
      }

      if (!REGEX.IMG.test(file.name)) {
        const error = MESSAGES.ERROR.UPLOAD_IMAGE;
        setErrorMessage(error);
        return;
      }

      if (file.size > MAX_SIZE) {
        const error = MESSAGES.ERROR.UPLOAD_IMAGE_SIZE;
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

      onFileChange(file);
    },
    [onFileChange, previewURL],
  );

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
        <div className="rounded-full w-32 h-32 bg-gray-50 dark:bg-gray-600 flex justify-center items-center">
          {previewURL || value ? (
            <ImageFallback
              src={previewURL || value}
              alt="Avatar"
              width={128}
              height={128}
              className="rounded-full object-cover w-full h-full"
              data-testid="avatar-preview"
              blurDataURL={undefined}
              placeholder={undefined}
            />
          ) : (
            <IoCamera
              data-testid="avatar-upload-icon"
              size={32}
              className="text-blue-800/70 dark:text-white/70"
            />
          )}
        </div>
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
