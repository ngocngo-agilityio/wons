import { memo } from 'react';
import isEqual from 'react-fast-compare';
// Models
import { ICustomer } from '@/models';

// Icons
import { GrPrevious } from 'react-icons/gr';

// Components
import CustomerDetailsHeader from './header';
import CustomerDetailsBody from './body';
import { LoadingIndicator, Button } from '../common';

interface ICustomerDetails {
  customer: ICustomer;
  isLoading?: boolean;
  onCloseDrawer?: () => void;
}

const CustomerDetails = ({
  customer,
  isLoading = false,
  onCloseDrawer,
}: ICustomerDetails) => {
  const {
    avatar = '',
    firstName = '',
    lastName = '',
    fullName = '',
    job = '',
    email = '',
    phone = '',
    address = '',
  } = customer ?? {};
  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <div className="min-h-full w-full bg-white dark:bg-gray-400 py-[62px] px-6">
      <Button
        data-testid="close-product-form"
        onClick={onCloseDrawer}
        className="p-2 bg-transparent dark:bg-transparent text-gray-200 dark:text-gray-300 hover:bg-transparent dark:hover:bg-transparent"
      >
        <GrPrevious size={20} />
      </Button>

      <CustomerDetailsHeader
        avatar={avatar}
        firstName={firstName}
        lastName={lastName}
        fullName={fullName}
        job={job}
      />

      <CustomerDetailsBody email={email} phone={phone} address={address} />
    </div>
  );
};

export default memo(CustomerDetails, isEqual);
