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
  distribution: { [key: number]: { [key: string]: number[] } };
  closeModal: () => void;
  resetBoard: () => void;
  gameOver: boolean;
  gameWon: boolean;
  answer: string;
  wordLength: number;
};

const calculateWidth = (num: number, distribution: number[]) => {
  if (num === 0) {
    return 6;
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
  wordLength,
  stats,
}: ModalProps) {
  const [selectedStatsKey, setSelectedStatsKey] = useState(dateToday());

  const [selectedWordLength, setSelectedWordLength] = useState(wordLength);

  const selectedStats =
    stats[selectedStatsKey] && stats[selectedStatsKey][selectedWordLength];
  const selectedDistribution =
    distribution[selectedStatsKey] &&
    distribution[selectedStatsKey][selectedWordLength];

  console.log(distribution);
  console.log({ selectedDistribution });
  // debugger;
  return (
    <Modal open={showStats} closeModal={closeModal}>
      <div className="modal-section">
        <h2 className="modal-heading">
          Stats for{' '}
          <select
            name="date"
            value={selectedStatsKey}
            onChange={(e) => setSelectedStatsKey(e.target.value)}
          >
            {stats &&
              Object.keys(stats).map((dateKey) => (
                <option key={dateKey} value={dateKey}>
                  {dateKey}
                </option>
              ))}
          </select>
          <select
            name="wordLength"
            value={selectedWordLength}
            onChange={(e) => setSelectedWordLength(parseInt(e.target.value))}
          >
            {stats &&
              [5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
          </select>
        </h2>
        <div className="stats">
          {selectedStats &&
            Object.keys(selectedStats).map((statKey) => (
              <Stat
                stat={selectedStats[statKey]}
                key={selectedStats[statKey].text}
              />
            ))}
        </div>
      </div>
      <div className="modal-section">
        <h2 className="modal-heading">Guess distribution</h2>
        <div className="distribution-container">
          {selectedDistribution &&
            selectedDistribution.map((num, i) => {
              return (
                <div key={i} className="guess-stats-wrapper">
                  <div>{i + 1}</div>
                  <div className="guess-bar">
                    <div
                      className={`filled-bar ${
                        Math.max(...selectedDistribution) === num && num !== 0
                          ? GREEN
                          : GREY
                      }`}
                      style={{
                        width: calculateWidth(num, selectedDistribution) + '%',
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
        {gameOver && !gameWon && <div>You lose, the word was {answer}</div>}
        {(gameOver || gameWon) && (
          <button className="button" onClick={resetBoard}>
            Play Again
          </button>
        )}
      </div>
    </Modal>
  );
}
