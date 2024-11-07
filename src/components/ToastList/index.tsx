import { memo } from 'react';
import isEqual from 'react-fast-compare';

// Types
import { TToast } from '@/types';

// Components
import { Toast } from '@/components/common';

// Constants
import { MESSAGES } from '@/constants';

interface IToastListProps {
  toasts: TToast[];
  onClose: (id: string) => void;
}

const ToastList = ({ toasts, onClose }: IToastListProps) => (
  <div className="fixed top-4 right-4">
    {toasts.map((toast) => {
      const {
        id = '',
        title = '',
        description = '',
        status = MESSAGES.STATUS.SUCCESS,
      } = toast;

      return (
        <Toast
          data-testid="toast"
          key={id}
          id={id}
          title={title}
          description={description}
          status={status}
          onClose={onClose}
        />
      );
    })}
  </div>
);

export default memo(ToastList, isEqual) as <T>(
  props: IToastListProps & T,
) => JSX.Element;
