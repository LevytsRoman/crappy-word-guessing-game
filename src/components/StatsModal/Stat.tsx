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
    <div>
      <div>{text}</div>
      <div>{count}</div>
    </div>
  );
}
