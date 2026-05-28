import type { Project } from "./types";
import { listRecipes } from "./promptTemplates";

export function buildBlueprintMarkdown(project: Project): string {
  const recipeMeta = Object.fromEntries(
    listRecipes().map((r) => [r.key, r.label])
  );
  const lines: string[] = [];

  lines.push(`# BootstrapFuel Blueprint — ${project.name}`);
  lines.push("");
  lines.push(
    `_Generated ${new Date(project.updatedAt).toISOString().slice(0, 19).replace("T", " ")} UTC_`
  );
  lines.push("");

  lines.push("## 1. Project inputs");
  lines.push("");
  lines.push("### Startup idea");
  lines.push("");
  lines.push(project.idea?.trim() || "_(not set)_");
  lines.push("");
  lines.push("### Audience guess");
  lines.push("");
  lines.push(project.audience?.trim() || "_(not set)_");
  lines.push("");
  lines.push("### Competitor context & gaps");
  lines.push("");
  lines.push(project.competitorContext?.trim() || "_(not set)_");
  lines.push("");

  lines.push("## 2. Generated marketing & strategy");
  lines.push("");
  const recipeKeys = Object.keys(project.outputs) as Array<
    keyof typeof project.outputs
  >;
  if (recipeKeys.length === 0) {
    lines.push("_No outputs generated yet._");
    lines.push("");
  } else {
    for (const key of recipeKeys) {
      const out = project.outputs[key];
      if (!out) continue;
      lines.push(`### ${recipeMeta[key as string] ?? key}`);
      lines.push("");
      lines.push(out.content.trim());
      lines.push("");
    }
  }

  lines.push("## 3. Action checklist");
  lines.push("");
  if (project.checklist.length === 0) {
    lines.push("_No actions extracted yet._");
  } else {
    for (const item of project.checklist) {
      lines.push(`- [${item.done ? "x" : " "}] ${item.text}`);
    }
  }
  lines.push("");

  lines.push("## 4. Capital matchmaker shortlist");
  lines.push("");
  if (project.fundingMatches.length === 0) {
    lines.push("_No funding matches yet — run the Capital Matchmaker._");
  } else {
    for (const m of project.fundingMatches) {
      lines.push(`### ${m.name} — _${m.type}_`);
      if (m.url) lines.push(`<${m.url}>`);
      lines.push("");
      lines.push(m.description);
      lines.push("");
      lines.push(`**Focus:** ${m.focusKeywords.join(", ")}`);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("Built with BootstrapFuel — open-source bootstrapping engine.");
  return lines.join("\n");
}

export function downloadBlueprint(project: Project): void {
  const md = buildBlueprintMarkdown(project);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "BOOTSTRAP_FUEL_BLUEPRINT.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
