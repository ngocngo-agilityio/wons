import isEqual from 'react-fast-compare';
import { memo } from 'react';

import {
  Autocomplete as AutocompleteBase,
  AutocompleteItem,
  AutocompleteProps as AutocompletePropsBase,
} from '@nextui-org/react';

// Types
import { IOptions } from '@/types';

interface AutocompleteProps extends Omit<AutocompletePropsBase, 'children'> {
  options: IOptions[];
}

const Autocomplete = ({
  placeholder = ' ',
  options,
  ...props
}: AutocompleteProps) => (
  <AutocompleteBase
    size="md"
    labelPlacement="outside"
    placeholder={placeholder}
    inputProps={{
      classNames: {
        inputWrapper:
          'h-[50px] bg-gray-50 dark:bg-gray-600 mt-1 rounded-[10px]',
        label: ['text-xl font-medium font-dm-sans pb-[5px]'],
      },
    }}
    classNames={{ selectorButton: 'text-gray-50 dark:text-gray-600' }}
    {...props}
  >
    {options.map(({ value = '', label = '' }) => (
      <AutocompleteItem key={value} value={value}>
        {label}
      </AutocompleteItem>
    ))}
  </AutocompleteBase>
);

export default memo(Autocomplete, isEqual) as <T>(
  props: AutocompleteProps & T,
) => JSX.Element;
