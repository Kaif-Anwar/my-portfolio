"use client";

import { useActionState } from "react";
import { saveContactAction, type ProjectFormState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { ContactContent, Profile } from "@/lib/types/project";

const initialState: ProjectFormState = {};

export function ContactForm({
  contact,
  profile,
}: {
  contact: ContactContent;
  profile: Profile;
}) {
  const [state, formAction, pending] = useActionState(saveContactAction, initialState);

  return (
    <Card>
      <form action={formAction} className="space-y-5">
        {state.error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {state.success}
          </p>
        )}

        <div>
          <Label htmlFor="heading">Section heading</Label>
          <Input id="heading" name="heading" defaultValue={contact.heading} required />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={4} defaultValue={contact.message} required />
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <h3 className="mb-4 font-semibold text-white">Contact links</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile.email} />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" name="linkedin" defaultValue={profile.linkedin} />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" name="github" defaultValue={profile.github} />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save contact section"}
        </Button>
      </form>
    </Card>
  );
}
