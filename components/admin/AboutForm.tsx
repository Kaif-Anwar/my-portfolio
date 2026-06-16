"use client";

import { useActionState } from "react";
import { saveAboutAction, type ProjectFormState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { Profile } from "@/lib/types/project";

const initialState: ProjectFormState = {};

export function AboutForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(saveAboutAction, initialState);

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

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={profile.name} required />
          </div>
          <div>
            <Label htmlFor="title">Title / headline</Label>
            <Input id="title" name="title" defaultValue={profile.title} required />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={profile.location} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={profile.phone} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={profile.email} />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" name="linkedin" defaultValue={profile.linkedin} />
          </div>
        </div>

        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input id="github" name="github" defaultValue={profile.github} />
        </div>

        <div>
          <Label htmlFor="bio">Bio (About section)</Label>
          <Textarea id="bio" name="bio" rows={6} defaultValue={profile.bio} required />
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <h3 className="mb-4 font-semibold text-white">Education</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="education_degree">Degree</Label>
              <Input
                id="education_degree"
                name="education_degree"
                defaultValue={profile.education.degree}
              />
            </div>
            <div>
              <Label htmlFor="education_school">School</Label>
              <Input
                id="education_school"
                name="education_school"
                defaultValue={profile.education.school}
              />
            </div>
            <div>
              <Label htmlFor="education_expected">Expected graduation</Label>
              <Input
                id="education_expected"
                name="education_expected"
                defaultValue={profile.education.expected}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save about section"}
        </Button>
      </form>
    </Card>
  );
}
