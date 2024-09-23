'use client';

// Libs
import { Key, useCallback, useState, useTransition } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

// Components
import {
  Button,
  CustomerDetails,
  CustomerForm,
  CustomerTable,
  LoadingIndicator,
} from '@/components';

// Types
import { TCustomerDataResponse } from '@/types';

// Mocks
import { CUSTOMER_MOCK } from '@/mocks';

// Hooks
import { useToast } from '@/hooks';

// Constants
import { MESSAGE_STATUS, SUCCESS_MESSAGES } from '@/constants';

// Actions
import { deleteCustomer, updateCustomer } from '@/actions';

// Models
import { ICustomer } from '@/models';

// Icons
import { IoClose } from 'react-icons/io5';

export type TCustomerListClientProps = {
  customerList: TCustomerDataResponse[];
  pageCount: number;
  isReadOnly?: boolean;
};

const CustomerListClient = ({
  customerList,
  pageCount,
  isReadOnly = true,
}: TCustomerListClientProps): JSX.Element => {
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = useState<ICustomer>(
    CUSTOMER_MOCK[1],
  );

  const [isPending, startTransition] = useTransition();
  console.log('isPending', isPending);
  // const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);
  const [customerForm, setCustomerForm] = useState<ICustomer>();
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  const handleCloseFormDrawer = () => {
    setToggleForm(false);
  };

  const handleEdit = useCallback(
    (id: number) => {
      const data: TCustomerDataResponse = customerList.find(
        (customer) => customer.id === id,
      ) as TCustomerDataResponse;

      setCustomerForm(data?.attributes);

      setToggleForm(true);
    },
    [customerList],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setIsLoading(true);

      const res = await deleteCustomer(id);

      setIsLoading(false);

      const { error } = res || {};

      showToast({
        description: error || SUCCESS_MESSAGES.DELETE_CUSTOMER,
        status: error ? MESSAGE_STATUS.ERROR : MESSAGE_STATUS.SUCCESS,
      });
    },
    [showToast],
  );

  // TODO: Update later
  const handleToggleSelectStart = useCallback(() => {}, []);

  const handleCloseDrawer = () => {
    setToggleDetails(false);
  };

  const handleRowAction = useCallback(
    async (key: Key) => {
      setToggleDetails(true);
      setIsLoadingDetails(true);

      const data: TCustomerDataResponse = customerList.find(
        (customer) => customer.id === Number(key),
      ) as TCustomerDataResponse;

      setCustomerDetails(data?.attributes);
      setIsLoadingDetails(false);
    },
    [customerList],
  );

  const handleFormSubmit = useCallback((payload: ICustomer) => {
    startTransition(async () => {
      const { error } = await updateCustomer(payload.id, payload);

      if (error) {
        showToast({
          description: error,
          status: MESSAGE_STATUS.ERROR,
        });

        return;
      }

      showToast({
        description: SUCCESS_MESSAGES.CREATE_CUSTOMER,
        status: MESSAGE_STATUS.SUCCESS,
      });
    });
  }, []);

  const handleAvatarChange = useCallback(() => {}, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <CustomerTable
        isReadOnly={isReadOnly}
        data={customerList}
        pageCount={pageCount}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleSelectStar={handleToggleSelectStart}
        onRowAction={handleRowAction}
      />
      {/* Customer Form Edit Drawer */}

      {customerForm && (
        <Drawer
          open={toggleForm}
          onClose={handleCloseFormDrawer}
          direction="right"
          size={400}
          className="!w-full md:!w-[400px]"
        >
          <div className="p-5 relative bg-white dark:bg-gray-400 h-full max-w-full">
            <Button
              onClick={handleCloseFormDrawer}
              className="absolute top-5 right-5 !bg-pink-50 dark:!bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer !px-0"
            >
              <IoClose size={20} />
            </Button>
            <CustomerForm
              isEdit
              previewData={customerForm}
              onAvatarChange={handleAvatarChange}
              onSubmit={handleFormSubmit}
              setReset={() => {}}
            />
          </div>
        </Drawer>
      )}

      {/* Customer Details Drawer */}
      <Drawer
        open={toggleDetails}
        onClose={handleCloseDrawer}
        direction="right"
        className="!w-[302px] !max-w-[302px]"
      >
        <CustomerDetails
          customer={customerDetails}
          isLoading={isLoadingDetails}
        />
      </Drawer>
    </>
  );
};

export default CustomerListClient;
