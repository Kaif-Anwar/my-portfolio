"use client";

import { useActionState, useState } from "react";
import { saveProjectAction, type ProjectFormState } from "@/lib/actions/admin";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { Project } from "@/lib/types/project";

const initialState: ProjectFormState = {};

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, pending] = useActionState(saveProjectAction, initialState);
  const [images, setImages] = useState<string[]>(project?.images ?? []);

  function addImage(url: string) {
    setImages((prev) => [...prev, url]);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  return (
    <Card>
      <form action={formAction} className="space-y-5">
        {project?.id && <input type="hidden" name="id" value={project.id} />}
        <input type="hidden" name="existing_images" value={images.join("\n")} />

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
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={project?.slug} placeholder="auto-generated if empty" />
          </div>
        </div>

        <div>
          <Label htmlFor="short_description">Short description</Label>
          <Textarea
            id="short_description"
            name="short_description"
            rows={2}
            defaultValue={project?.short_description}
          />
        </div>

        <div>
          <Label htmlFor="long_description">Long description</Label>
          <Textarea
            id="long_description"
            name="long_description"
            rows={6}
            defaultValue={project?.long_description}
          />
        </div>

        <div>
          <Label htmlFor="tech_stack">Tech stack (comma-separated)</Label>
          <Input
            id="tech_stack"
            name="tech_stack"
            defaultValue={project?.tech_stack.join(", ")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input id="github_url" name="github_url" defaultValue={project?.github_url ?? ""} />
          </div>
          <div>
            <Label htmlFor="live_url">Live URL</Label>
            <Input id="live_url" name="live_url" defaultValue={project?.live_url ?? ""} />
          </div>
        </div>

        <div>
          <Label htmlFor="video_url">Video URL (upload below or paste YouTube/Vimeo link)</Label>
          <Input id="video_url" name="video_url" defaultValue={project?.video_url ?? ""} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={project?.sort_order ?? 0}
            />
          </div>
          <div>
            <Label htmlFor="start_date">Start date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={project?.start_date ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="end_date">End date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={project?.end_date ?? ""}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured}
              className="rounded border-white/20"
            />
            Featured
          </label>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? "draft"}
              className="mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <MediaUploader
          bucket="project-images"
          label="Upload images"
          accept="image/*"
          onUploaded={addImage}
        />

        <MediaUploader
          bucket="project-videos"
          label="Upload video"
          accept="video/*"
          onUploaded={(url) => {
            const input = document.getElementById("video_url") as HTMLInputElement | null;
            if (input) input.value = url;
          }}
        />

        {images.length > 0 && (
          <div>
            <Label>Uploaded images</Label>
            <ul className="mt-2 space-y-2">
              {images.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400"
                >
                  <span className="truncate">{url}</span>
                  <Button type="button" variant="ghost" onClick={() => removeImage(url)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : project ? "Update project" : "Create project"}
        </Button>
      </form>
    </Card>
  );
}
