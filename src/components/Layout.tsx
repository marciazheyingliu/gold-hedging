import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1f2b3d] to-[#1a2332] text-white">
        <Header />
        <main className="w-full">
          <Outlet />
        </main>
        <Footer />
        <Toaster
          theme="dark"
          position="top-right"
        />
      </div>
    </LanguageProvider>
  );
}
