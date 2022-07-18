import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useState } from 'react';
import { CloseButtonIcon } from '../Icons/CloseButtonIcon';
import './index.scss';
type ModalProps = {
  open: boolean;
  closeModal: () => void;
  children?: JSX.Element | JSX.Element[];
};

export default function Modal({ open, closeModal, children }: ModalProps) {
  const modalEl = useRef(null);
  const backDropRef = useRef(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (open) {
        modalEl.current.classList.add('modal-show');
        backDropRef.current.classList.add('fade');
      } else {
        modalEl.current.classList.remove('modal-show');
        backDropRef.current.classList.remove('fade');
      }
    }, 0);
  });

  return (
    <div>
      <div
        ref={backDropRef}
        onClick={closeModal}
        className={classNames('modal-backdrop', { hide: !open })}
      ></div>
      <div ref={modalEl} className="modal-container">
        <button onClick={closeModal} className="icon-button modal-close">
          <CloseButtonIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
