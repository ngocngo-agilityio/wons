import type { Meta } from '@storybook/react';

// Mocks
import { PRODUCT_TABLE_COLUMNS_MOCK, CUSTOMER_MOCK } from '@/mocks';

// Components
import { Table } from './index';

const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

const props = {
  columns: PRODUCT_TABLE_COLUMNS_MOCK,
  data: CUSTOMER_MOCK,
};

export const Secondary = () => (
  <div className="bg-[white] p-[20px] rounded-2xl">
    <Table {...props} variant="secondary" isStriped />
  </div>
);

export const Primary = () => (
  <div className="p-[20px] rounded-2xl">
    <Table {...props} variant="primary" />
  </div>
);
