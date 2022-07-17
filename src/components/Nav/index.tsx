import classNames from 'classnames';
import './index.scss';
import { StatsIcon } from '../Icons/StatsIcon';
type NavProps = {
  openStats: () => void;
  // letter: {
  //   letter: string;
  //   color?: string;
  // };
};

export default function Nav({ openStats }: NavProps) {
  return (
    <div className="nav-wrapper">
      <button onClick={openStats}>
        <StatsIcon />
      </button>
    </div>
  );
}
