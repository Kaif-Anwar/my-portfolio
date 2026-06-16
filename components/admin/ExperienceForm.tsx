"use client";

import { useActionState, useState } from "react";
import { saveExperienceAction, type ProjectFormState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { Experience } from "@/lib/types/project";

const initialState: ProjectFormState = {};

export function ExperienceForm({ experiences }: { experiences: Experience[] }) {
  const [items, setItems] = useState<Experience[]>(experiences);
  const [state, formAction, pending] = useActionState(saveExperienceAction, initialState);

  function updateItem(index: number, field: keyof Experience, value: string | string[]) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { title: "", organization: "", period: "", bullets: [""] },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="experiences_json" value={JSON.stringify(items)} />

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

        <div className="space-y-6">
          {items.map((exp, index) => (
            <div key={index} className="rounded-xl border border-white/10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-white">Entry {index + 1}</h3>
                {items.length > 1 && (
                  <Button type="button" variant="ghost" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="Executive Member"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={exp.period}
                    onChange={(e) => updateItem(index, "period", e.target.value)}
                    placeholder="2024 – 2025"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label>Organization</Label>
                <Input
                  value={exp.organization}
                  onChange={(e) => updateItem(index, "organization", e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Label>Bullet points (one per line)</Label>
                <Textarea
                  rows={4}
                  value={exp.bullets.join("\n")}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "bullets",
                      e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={addItem}>
            Add experience
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save experience section"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
