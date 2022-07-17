import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useState } from 'react';
import './index.scss';
import Modal from '../Modal';
import Stat from './Stat';
import { StatsType } from '../../utils/stats-utils';
type ModalProps = {
  showStats: boolean;
  stats: StatsType;
  distribution: number[];
  closeModal: () => void;
  resetBoard: () => void;
};

export default function StatsModal({
  showStats,
  closeModal,
  stats,
  resetBoard,
  distribution,
}: ModalProps) {
  return (
    <Modal showStats={showStats} closeModal={closeModal}>
      <div>
        <h2>STATISTICS</h2>
        {Object.keys(stats).map((statKey) => (
          <Stat stat={stats[statKey]} key={stats[statKey].text} />
        ))}
      </div>
      <div>
        <h2>Guess Distribution</h2>
        {distribution.map((num, i) => (
          <div key={i}>{num}</div>
        ))}
      </div>
      <button onClick={resetBoard}>Play Again</button>
    </Modal>
  );
}
