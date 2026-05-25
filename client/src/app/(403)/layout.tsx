import { SiteHeader } from '@/components/site-header';
import Footer from '@/components/footer';

export default function ForbiddenLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-180px)]">{children}</main>
      <Footer />
    </>
  );
}
