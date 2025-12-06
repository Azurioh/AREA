import { useState, useRef, useEffect } from 'react';

/**
 * @function useActionsModal
 * @description Custom hook to manage actions modal state and behavior
 *
 * @returns {object} Modal state and handlers
 */
export function useActionsModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return { isModalOpen, openModal, closeModal, modalRef, buttonRef };
}
