import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useState } from 'react';
import './index.scss';
type ModalProps = {
  showStats: boolean;
  closeModal: () => void;
  children?: JSX.Element | JSX.Element[];
};

export default function Modal({ showStats, closeModal, children }: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(showStats);
  });

  return (
    <div className={classNames({ hide: !showStats })}>
      <div onClick={closeModal} className="modal-backdrop"></div>
      <div className="modal-container">{children}</div>
    </div>
  );
}
