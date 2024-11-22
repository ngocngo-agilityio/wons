'use client';

import React, {
  ChangeEvent,
  forwardRef,
  memo,
  useEffect,
  useState,
} from 'react';
import { InputProps } from '@nextui-org/react';
import { useDebounce } from 'use-debounce';

// Icons
import { HiLocationMarker } from 'react-icons/hi';

// Components
import { Input, LocationSuggestion } from '@/components';

// Services
import { getLocationSuggestion } from '@/services';

interface AddressInputProps extends Omit<InputProps, 'onChange'> {
  onChange: (value: string) => void;
}

interface LocationItem {
  properties: {
    formatted: string;
    name: string;
  };
}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ placeholder = ' ', value, onChange, ...rest }, ref) => {
    const [searchAddress, setSearchAddress] = useState(value);
    const [locationsSuggestion, setLocationsSuggestion] = useState<
      LocationItem[]
    >([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Debounce searchAddress with a delay of 300ms
    const [debouncedSearchAddress] = useDebounce(searchAddress, 300);

    const handleOnChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
      setIsOpen(true);

      const value = event.target.value;
      onChange && onChange(value);
      setSearchAddress(value);
    };

    useEffect(() => {
      const handleFetchData = async (keyword: string) => {
        const locationResponse = await getLocationSuggestion(keyword);

        setLocationsSuggestion(
          locationResponse?.features ? locationResponse.features : [],
        );
      };

      if (debouncedSearchAddress) {
        handleFetchData(debouncedSearchAddress);
      } else {
        setLocationsSuggestion([]);
      }
    }, [debouncedSearchAddress]);

    const handleClickSuggestion = (value: string) => {
      setSearchAddress(value);
      setLocationsSuggestion([]);
      setIsOpen(false);

      onChange && onChange(value);
    };

    return (
      <div className="relative flex-1">
        <Input
          ref={ref}
          placeholder={placeholder}
          value={searchAddress}
          onChange={handleOnChangeSearch}
          endContent={<HiLocationMarker />}
          {...rest}
        />
        {locationsSuggestion.length !== 0 && isOpen && (
          <div className="shadow-md p-3 absolute z-50 bg-white dark:bg-gray-400 w-full">
            {locationsSuggestion.map(({ properties }: LocationItem) => {
              const { formatted = '', name = '' } = properties;

              return (
                <LocationSuggestion
                  formatted={formatted}
                  key={name}
                  onClickSuggestion={handleClickSuggestion}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

AddressInput.displayName = 'AddressInput';

export default memo(AddressInput);
