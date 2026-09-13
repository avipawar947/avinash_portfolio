/**
 * Minimal class-name joiner.
 *
 * Deliberately dependency-free: the project spec forbids unnecessary
 * libraries, and the handful of conditional-class cases here do not
 * justify pulling in `clsx` + `tailwind-merge`.
 *
 * Note this does NOT de-duplicate conflicting Tailwind utilities. Order
 * your classes so the intended winner comes last, or lift the variance
 * into a single conditional branch.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;

    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}
