import Link from "next/link";
import { ContactForm } from "@/components/admin/ContactForm";
import { getContactContent, getProfile } from "@/lib/site-content";

export default async function EditContactPage() {
  const [contact, profile] = await Promise.all([getContactContent(), getProfile()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Edit Contact section</h1>
        <p className="mt-2 text-slate-400">
          Update the contact heading, message, and social links.
        </p>
      </div>
      <ContactForm contact={contact} profile={profile} />
    </div>
  );
}
