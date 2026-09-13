import { clsx } from 'clsx';

/** Reusable white→transparent gradient-clipped text, used on most section headings. */
export default function GradientText({
  as: Tag = 'span',
  className,
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={clsx('bg-text-gradient bg-clip-text text-transparent', className)}
    >
      {children}
    </Tag>
  );
}
