import Link from 'next/link';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Forbidden | ABU Law Clinic',
  description: 'You do not have access to this area of the clinic platform.',
};

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <ShieldOff className="mx-auto mb-6 size-12 text-muted-foreground" aria-hidden />
      <h1 className="text-3xl font-serif font-semibold tracking-tight">You don&apos;t have access to this page</h1>
      <p className="mt-4 text-muted-foreground">
        This area is restricted to clinic staff. If you believe this is a mistake, contact the clinic administrator.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
