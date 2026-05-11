import type { Metadata } from 'next';
import { Fraunces, Inter_Tight } from 'next/font/google';
import './globals.css';

const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coupon Scout AU',
  description:
    'Find the best currently available Australian coupons and sale offers, with a transparent reason why each ranks first.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
