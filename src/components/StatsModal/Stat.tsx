import classNames from 'classnames';

type StatProps = {
  stat: {
    text: string;
    count: number;
  };
};

export default function Stat({ stat }: StatProps) {
  const { text, count } = stat;
  return (
    <div className="stat-box">
      <div className="stat-number">{Math.ceil(count)}</div>
      <div className="stat-header">{text}</div>
    </div>
  );
}
