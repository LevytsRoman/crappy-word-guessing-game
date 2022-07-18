import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useState } from 'react';
import './index.scss';
import Modal from '../Modal';
import Stat from './Stat';
import { StatsType } from '../../utils/stats-utils';
import { GREEN, GREY } from '../constants';
import { save, retrieve, remove } from '../../storage/localStorage';
import { dateToday } from '../../utils/stats-utils';

type ModalProps = {
  showStats: boolean;
  stats: { [key: string]: StatsType };
  distribution: { [key: string]: number[] };
  closeModal: () => void;
  resetBoard: () => void;
  gameOver: boolean;
  gameWon: boolean;
  answer: string;
};

const calculateWidth = (num: number, distribution: number[]) => {
  if (num === 0) {
    return 5;
  }
  return (num / Math.max(...distribution)) * 100;
};

export default function StatsModal({
  showStats,
  closeModal,
  resetBoard,
  distribution,
  gameOver,
  answer,
  gameWon,
  stats,
}: ModalProps) {
  const [selectedStatsKey, setSelectedStatsKey] = useState(dateToday());

  console.log(selectedStatsKey);
  return (
    <Modal open={showStats} closeModal={closeModal}>
      <div className="modal-section">
        <h2 className="modal-heading">
          STATISTICS for{' '}
          <select
            name="date"
            defaultValue={selectedStatsKey}
            onChange={(e) => setSelectedStatsKey(e.target.value)}
          >
            {stats &&
              Object.keys(stats).map((dateKey) => (
                <option key={dateKey} value={dateKey}>
                  {dateKey}
                </option>
              ))}
          </select>
        </h2>
        <div className="stats">
          {stats &&
            stats[selectedStatsKey] &&
            Object.keys(stats[selectedStatsKey]).map((statKey) => (
              <Stat
                stat={stats[selectedStatsKey][statKey]}
                key={stats[selectedStatsKey][statKey].text}
              />
            ))}
        </div>
      </div>
      <div className="modal-section">
        <h2 className="modal-heading">GUESS DISTRIBUTION</h2>
        <div className="distribution-container">
          {distribution[selectedStatsKey].map((num, i) => {
            return (
              <div key={i} className="guess-stats-wrapper">
                <div>{i + 1}</div>
                <div className="guess-bar">
                  <div
                    className="filled-bar"
                    style={{
                      backgroundColor:
                        Math.max(...distribution[selectedStatsKey]) === num &&
                        num !== 0
                          ? GREEN
                          : GREY,
                      width:
                        calculateWidth(num, distribution[selectedStatsKey]) +
                        '%',
                    }}
                  >
                    {num}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="modal-section">
        {gameOver && <div>You lose, the word was {answer}</div>}
        {(gameOver || gameWon) && (
          <button className="button" onClick={resetBoard}>
            Play Again
          </button>
        )}
      </div>
    </Modal>
  );
}
