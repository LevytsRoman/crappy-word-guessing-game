import classNames from 'classnames';
import './index.scss';
import { StatsIcon } from '../Icons/StatsIcon';
import { SettingsIcon } from '../Icons/SettingsIcon';
type NavProps = {
  openStats: () => void;
  openSettings: () => void;
};

export default function Nav({ openStats, openSettings }: NavProps) {
  return (
    <div className="nav-wrapper">
      <button className="icon-button" onClick={openStats}>
        <StatsIcon />
      </button>
      <button className="icon-button" onClick={openSettings}>
        <SettingsIcon />
      </button>
    </div>
  );
}
