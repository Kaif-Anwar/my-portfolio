"use client";

import { deleteProjectAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";

export function DeleteProjectButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Delete this project?")) return;
    await deleteProjectAction(id);
    window.location.reload();
  }

  return (
    <Button type="button" variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
}
