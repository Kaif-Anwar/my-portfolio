"use client";

import { useActionState, useState } from "react";
import { saveSkillsAction, type ProjectFormState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { SkillGroup } from "@/lib/types/project";

const initialState: ProjectFormState = {};

export function SkillsForm({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const [groups, setGroups] = useState<SkillGroup[]>(skillGroups);
  const [state, formAction, pending] = useActionState(saveSkillsAction, initialState);

  function updateCategory(index: number, category: string) {
    setGroups((prev) =>
      prev.map((group, i) => (i === index ? { ...group, category } : group))
    );
  }

  function updateItems(index: number, itemsRaw: string) {
    const items = itemsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setGroups((prev) =>
      prev.map((group, i) => (i === index ? { ...group, items } : group))
    );
  }

  function addCategory() {
    setGroups((prev) => [...prev, { category: "", items: [] }]);
  }

  function removeCategory(index: number) {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="skill_groups_json" value={JSON.stringify(groups)} />

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

        <div className="space-y-4">
          {groups.map((group, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <Label htmlFor={`category-${index}`}>Category name</Label>
                {groups.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeCategory(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                id={`category-${index}`}
                value={group.category}
                onChange={(e) => updateCategory(index, e.target.value)}
                placeholder="e.g. Languages"
              />
              <div className="mt-3">
                <Label htmlFor={`items-${index}`}>Skills (comma-separated)</Label>
                <Input
                  id={`items-${index}`}
                  value={group.items.join(", ")}
                  onChange={(e) => updateItems(index, e.target.value)}
                  placeholder="JavaScript, Python, C++"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={addCategory}>
            Add category
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save technologies section"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
