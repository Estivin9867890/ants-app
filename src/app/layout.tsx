import type { Metadata } from 'next';
import './globals.css';
import { SessionsProvider } from '@/lib/SessionsContext';

export const metadata: Metadata = {
  title: 'Ants',
  description: 'Organise tes sessions de sport',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#F9F9F9' }}>
        <SessionsProvider>
          {children}
        </SessionsProvider>
      </body>
    </html>
  );
}
