import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coupon Scout AU',
  description:
    'Find the best currently available Australian coupons and sale offers, with a transparent reason why each ranks first.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
