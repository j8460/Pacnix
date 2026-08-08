import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundView() {
  return (
    <section className="section-padding flex min-h-[70vh] items-center justify-center">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Go to home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              Browse products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
