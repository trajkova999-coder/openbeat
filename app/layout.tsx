import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenBeat — The interactive heart lab',
  description:
    'Follow one heartbeat. Explore cardiac electrical conduction and the ECG in an open-source learning studio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
