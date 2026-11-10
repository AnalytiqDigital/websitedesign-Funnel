import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AnalytIQ Chat Desk',
  description: 'Manage leads, handoffs and WhatsApp conversations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
