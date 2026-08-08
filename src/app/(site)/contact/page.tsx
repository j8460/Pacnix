import type { Metadata } from "next";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { getCompany, getProducts } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Pacnix India — address, phone, email, WhatsApp, map, and product enquiry form.",
};

export default async function ContactPage() {
  const [company, products] = await Promise.all([getCompany(), getProducts()]);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Share your packaging requirements — our team will respond with next steps."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              {company.legalName}
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>
                  <strong className="block text-slate-900">Owner</strong>
                  {company.owner}
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>
                  <strong className="block text-slate-900">Address</strong>
                  {company.contact.address}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>
                  <strong className="block text-slate-900">Phone</strong>
                  <a href={`tel:${company.contact.phone}`} className="hover:text-primary">
                    {company.contact.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>
                  <strong className="block text-slate-900">Email</strong>
                  <a href={`mailto:${company.contact.email}`} className="hover:text-primary">
                    {company.contact.email}
                  </a>
                </span>
              </li>
            </ul>
            <a
              href={`https://wa.me/${company.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white"
            >
              Chat on WhatsApp
            </a>
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
              <iframe
                title="Pacnix India location map"
                src={company.contact.mapEmbedUrl}
                className="h-64 w-full border-0 md:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <ContactForm products={products} />
        </div>
      </section>
    </>
  );
}
