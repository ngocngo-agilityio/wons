'use client';

import { ChangeEvent, MouseEvent, memo, useState } from 'react';
import isEqual from 'react-fast-compare';

// Icons
import { IoCamera, IoClose } from 'react-icons/io5';

// constants
import { MESSAGES } from '@/constants';

// Utils
import { filterDataByIndex } from '@/utils';

// Components
import { Input, Button, Text, ImageFallback } from '@/components';

export interface TAvatarUploadMultipleProps {
  previewFiles?: string[];
  onFileChange: (previewFiles?: string[], selectedFiles?: File[]) => void;
}

const AvatarUploadMultiple = ({
  previewFiles = [],
  onFileChange,
}: TAvatarUploadMultipleProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentPreviewFiles, setCurrentPreviewFiles] =
    useState<string[]>(previewFiles);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isUploadDisabled = currentPreviewFiles?.length >= 2;

  const uploadMultipleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const values = Array.from(event.target.files ?? []);
    const allSelectedFiles = [...selectedFiles, ...values];

    if (currentPreviewFiles.length > 2) {
      setErrorMessage(MESSAGES.ERROR.MAX_IMAGE);
      return;
    }

    if (currentPreviewFiles.length === 1 && values.length > 2) {
      setErrorMessage(MESSAGES.ERROR.UPLOAD_IMAGE_SIZE);
      return;
    }

    setErrorMessage('');
    setSelectedFiles(allSelectedFiles);

    const newPreviewFiles: string[] = [
      ...currentPreviewFiles,
      ...values.map((value) => URL.createObjectURL(value)),
    ];

    setCurrentPreviewFiles(newPreviewFiles);
    onFileChange(newPreviewFiles, allSelectedFiles);
  };

  const clickInput = (event: MouseEvent<HTMLInputElement>) => {
    (event.target as HTMLInputElement).value = '';
  };

  const deleteFile = (indexFile: number) => {
    const updatedPreviewFiles = filterDataByIndex(previewFiles, indexFile);
    const updatedSelectedFiles = filterDataByIndex(selectedFiles, indexFile);

    setCurrentPreviewFiles(updatedPreviewFiles);
    onFileChange(updatedPreviewFiles, updatedSelectedFiles);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <label
        htmlFor="file"
        className={`flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all p-11 ${
          isUploadDisabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-blue-500'
        }`}
      >
        <IoCamera size={24} className="text-blue-800/70" />
        <Text className="ml-2" text="Upload Image" />
      </label>

      <Input
        multiple
        id="file"
        type="file"
        aria-label="Upload Avatar"
        className="hidden"
        accept="image/*"
        onChange={uploadMultipleFile}
        disabled={isUploadDisabled}
        onClick={clickInput}
      />

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {currentPreviewFiles?.map((file, index) => {
          const handleChangeDelete = () => {
            deleteFile(index);
          };

          return (
            <div key={`file_${index}`} className="relative w-24 h-24">
              <ImageFallback
                src={file}
                alt={`Uploaded image ${index + 1}`}
                width={96}
                height={96}
                className="rounded-md object-cover w-full h-full"
              />
              <Button
                isIconOnly
                color="secondary"
                className="absolute top-0 right-0 p-1 border-none rounded-none rounded-tr-md hover:bg-gray-200/50 dark:hover:bg-gray-900"
                onClick={handleChangeDelete}
              >
                <IoClose size={16} className="text-pink-500" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(AvatarUploadMultiple, isEqual);
