import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR Codes Dynamiques - 100% Gratuit',
  description: 'Générez et gérez des QR codes dynamiques gratuitement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <footer className="bg-gray-800 text-white text-center p-4 mt-12">
          <p>© 2024 QR Codes Dynamiques - Hébergé gratuitement sur Vercel</p>
          <p className="text-sm text-gray-400 mt-2">
            Utilise MongoDB Atlas et Next.js 14
          </p>
        </footer>
      </body>
    </html>
  );
}