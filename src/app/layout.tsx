import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MobileGames.win - Las Mejores Reviews de Juegos Móviles',
  description: 'Descubre los mejores juegos móviles para Android e iOS. Reviews detalladas, comparativas TOP 5 y guías completas.',
  keywords: 'juegos móviles, Android, iOS, reviews, top 5, mejores juegos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}