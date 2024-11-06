'use client';

import { memo, useCallback, useState } from 'react';

import {
  Dropdown as NextUIDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DropdownSection,
} from '@nextui-org/react';

// icons
import { RiEdit2Fill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { FaEllipsisH } from 'react-icons/fa';

// components
import { ConfirmModal } from '@/components';

interface DropdownActionsProps {
  id: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isIconOnly?: boolean;
  disableAnimation?: boolean;
  customClassName?: string;
}

const DropdownActions = ({
  id,
  onEdit,
  onDelete,
  isIconOnly = false,
  disableAnimation = false,
  customClassName,
}: DropdownActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = useCallback(() => setIsModalOpen(true), []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(id);
    setIsModalOpen(false);
  }, [id, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);

  return (
    <>
      <NextUIDropdown
        showArrow
        classNames={{
          base: 'bg-white dark:bg-[#1A202C] rounded-[15px]',
          content:
            'py-2 pb-0 px-2 border border-transparent bg-dark-800 shadow-lg',
        }}
      >
        <DropdownTrigger>
          <Button
            aria-label="More actions for item"
            data-testid="actions-btn"
            className={`border-none bg-bone ${customClassName}`}
            isIconOnly={isIconOnly}
            disableAnimation={disableAnimation}
          >
            <FaEllipsisH
              aria-label="Dropdown Actions"
              size={14}
              className="text-blue-800/30 dark:text-white/30"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="flat" aria-label="Dropdown menu">
          <DropdownSection className="mb-[0.65rem]">
            <DropdownItem
              key="edit"
              className="bg-[#f5f5fc] dark:bg-[#2f3268] py-3 text-[#605cf8]"
              startContent={
                <RiEdit2Fill className="text-blue-500 dark:text-purple-600 rounded-" />
              }
              onClick={handleEdit}
            >
              Edit
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="delete"
              className="bg-[#fff7fb] dark:bg-pink-600 py-3 text-pink-500"
              startContent={<AiFillDelete className="text-pink-500" />}
              onClick={handleDelete}
            >
              Delete
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </NextUIDropdown>
      <ConfirmModal
        title="Delete Item"
        content="Are you sure you want to delete this item?"
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default memo(DropdownActions);
