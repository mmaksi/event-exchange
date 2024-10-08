import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <div className="flex flex-grow py-8">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
