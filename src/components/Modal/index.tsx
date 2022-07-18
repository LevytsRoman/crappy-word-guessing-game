import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { CloseButtonIcon } from '../Icons/CloseButtonIcon';
import './index.scss';
type ModalProps = {
  open: boolean;
  closeModal: () => void;
  children?: JSX.Element | JSX.Element[];
};

export default function Modal({ open, closeModal, children }: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(open);
  });

  return (
    <div className={classNames({ hide: !open })}>
      <div onClick={closeModal} className="modal-backdrop"></div>
      <div className="modal-container">
        <button onClick={closeModal} className="icon-button modal-close">
          <CloseButtonIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
