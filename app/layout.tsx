import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Avinash Pawar — Product Designer',
  description: 'UI/UX & Product Designer portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`} style={{ ['--font-display' as any]: "'SF Pro Display'" }}>
        {children}
      </body>
    </html>
  );
}
