import './index.scss';
import { useLayoutEffect, useState } from 'react';
import { CloseButtonIcon } from '../Icons/CloseButtonIcon';

export default function Notification({ text }: { text: string }) {
  useLayoutEffect(() => {
    setTimeout(() => {
      document.querySelector('.notification-container').classList.add('move');
    }, 5);
  }, []);

  return <div className="notification-container">{text}</div>;
}
