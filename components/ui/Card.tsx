import { clsx } from 'clsx';

/** Card gradient surface used for stat cards, tool tiles, project frames. */
export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('rounded-card bg-card-gradient', className)}>{children}</div>
  );
}
