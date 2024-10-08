// Libs
import Link from 'next/link';

// Utils
import { isAdmin } from '@/utils';

// Components
import { Button, SearchInput, BsPlus } from '@/components';

// Constants
import { ROUTES } from '@/constants';

const InvoiceListActions = async (): Promise<JSX.Element> => {
  const isSuperAdmin = await isAdmin();

  return (
    <div className="mb-1 flex items-center gap-5 base:mt-10 md:mt-0 base:flex-col md:flex-row">
      <SearchInput className="base:!w-full md:!w-[230px]" />
      {isSuperAdmin && (
        <Link href={ROUTES.CREATE_INVOICE} className="base:w-full md:w-[122px]">
          <Button
            color="primary"
            startContent={<BsPlus size={22} className="text-white" />}
            className="text-xl font-medium base:w-full md:w-[122px] h-10 base:gap-2 md:gap-0.5"
          >
            Add New
          </Button>
        </Link>
      )}
    </div>
  );
};

export default InvoiceListActions;
