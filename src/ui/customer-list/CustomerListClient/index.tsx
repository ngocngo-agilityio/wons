'use client';

// Libs
import {
  Key,
  memo,
  useCallback,
  useState,
  useTransition,
  useEffect,
} from 'react';
import isEqual from 'react-fast-compare';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
import { useBreakPoints, useToast } from '@/hooks';

// Constants
import { MESSAGES, ORDER, SEARCH_QUERIES } from '@/constants';

// Actions
import { deleteCustomer, updateCustomer } from '@/actions';

// Models
import { ICustomer } from '@/models';

// Icons
import { IoClose } from 'react-icons/io5';

// Utils
import {
  formatPhoneNumberTyping,
  handleUpdateImage,
  preventScrollFromState,
} from '@/utils';

export type TCustomerListClientProps = {
  customerList: TCustomerDataResponse[];
  pageCount: number;
  order?: string;
};

const CustomerListClient = ({
  customerList,
  pageCount,
  order = '',
}: TCustomerListClientProps): JSX.Element => {
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = useState<ICustomer>(
    CUSTOMER_MOCK[1],
  );
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [customerForm, setCustomerForm] = useState<ICustomer>();
  const [idCustomer, setIdCustomer] = useState<number>();
  const [toggleForm, setToggleForm] = useState<boolean>(false);
  const { isGreaterThanMd } = useBreakPoints();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const paramsObject = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};

  const handleCloseFormDrawer = () => {
    setToggleForm(false);
  };

  const handleEdit = useCallback(
    (id: number) => {
      setIdCustomer(id);

      const data: TCustomerDataResponse = customerList.find(
        (customer) => customer.id === id,
      ) as TCustomerDataResponse;

      setCustomerForm(data?.attributes);

      setToggleForm(true);
    },
    [customerList, setCustomerForm, setToggleForm],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setIsLoading(true);

      const res = await deleteCustomer(id);

      setIsLoading(false);

      const { error } = res || {};

      showToast({
        description: error || MESSAGES.SUCCESS.DELETE_CUSTOMER,
        status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
      });
    },
    [showToast],
  );

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(SEARCH_QUERIES.SORT_BY, value);
      params.set(
        SEARCH_QUERIES.ORDER,
        order === ORDER.DESC ? ORDER.ASC : ORDER.DESC,
      );
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: ICustomer) => {
      if (avatarFile && isAvatarDirty) {
        const { url = '' } = await handleUpdateImage(avatarFile);

        payload.avatar = url;
      }

      startTransition(async () => {
        if (idCustomer) {
          const formattedPayload = {
            ...payload,
            phone: formatPhoneNumberTyping(payload.phone),
          };

          const { error } = await updateCustomer(idCustomer, formattedPayload);

          showToast({
            description: error ?? MESSAGES.SUCCESS.UPDATE_CUSTOMER,
            status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
          });
        }
      });

      setToggleForm(false);
    },
    [idCustomer, showToast, avatarFile, isAvatarDirty],
  );

  useEffect(() => {
    // Prevent scrolling based on toggleForm and toggleDetails states
    const shouldDisableScroll = toggleDetails || toggleForm;
    preventScrollFromState(shouldDisableScroll);
  }, [toggleDetails, toggleForm]);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <CustomerTable
        data={customerList}
        onSort={handleSort}
        sortBy={paramsObject.sortBy}
        order={paramsObject.order}
        pageCount={pageCount}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowAction={handleRowAction}
      />

      {/* Customer Form Edit Drawer */}
      {customerForm && toggleForm && (
        <Drawer
          open={toggleForm}
          onClose={handleCloseFormDrawer}
          direction="right"
          size={isGreaterThanMd ? 450 : 375}
          className="overflow-auto"
        >
          <div className="p-5 relative bg-white dark:bg-gray-400 h-full max-w-full">
            <Button
              data-testid="close-form-drawer"
              onClick={handleCloseFormDrawer}
              className="absolute top-5 right-5 bg-pink-50 dark:bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer px-0"
            >
              <IoClose size={20} />
            </Button>
            <CustomerForm
              previewData={customerForm}
              isDisabledField={isPending}
              onAvatarChange={handleAvatarChange}
              onSubmit={handleFormSubmit}
              onCloseDrawer={handleCloseFormDrawer}
            />
          </div>
        </Drawer>
      )}

      {/* Customer Details Drawer */}
      {toggleDetails && customerDetails && (
        <Drawer
          open={toggleDetails}
          onClose={handleCloseDrawer}
          direction="right"
          size={302}
          className="overflow-y-auto"
        >
          <CustomerDetails
            customer={customerDetails}
            isLoading={isLoadingDetails}
          />
        </Drawer>
      )}
    </>
  );
};

export default memo(CustomerListClient, isEqual);
