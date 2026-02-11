/**
 * Generate chunks.json from MDX docs for Kano Agent RAG.
 * Chunk strategy: H2 as unit, optionally H3; ~256-512 tokens per chunk.
 * Output: public/chunks.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../src/content/docs");
const OUT_FILE = path.join(__dirname, "../public/chunks.json");

const MAX_CHUNK_CHARS = 1800; // ~450 tokens
const OVERLAP_CHARS = 200; // ~50 tokens

/**
 * Strip frontmatter (between --- and ---).
 */
function stripFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[2].trim() : raw.trim();
}

/**
 * Convert markdown to plain text for embedding (strip MD/MDX syntax).
 */
function mdToPlainText(md) {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/^\s*\d+\.\s+/gm, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Split body by ## and ###, return [{ level, title, content }].
 */
function splitByHeadings(body) {
  const sections = [];
  const lines = body.split("\n");
  let current = { level: 0, title: "", content: [] };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      if (current.content.length > 0) {
        sections.push({
          level: current.level,
          title: current.title,
          content: current.content.join("\n").trim(),
        });
      }
      current = { level: 2, title: h2[1].trim(), content: [] };
    } else if (h3) {
      if (current.content.length > 0) {
        sections.push({
          level: current.level,
          title: current.title,
          content: current.content.join("\n").trim(),
        });
      }
      current = { level: 3, title: h3[1].trim(), content: [] };
    } else {
      current.content.push(line);
    }
  }
  if (current.content.length > 0) {
    sections.push({
      level: current.level,
      title: current.title,
      content: current.content.join("\n").trim(),
    });
  }
  return sections;
}

/**
 * If content is too long, split with overlap.
 */
function splitLargeChunk(text, maxChars = MAX_CHUNK_CHARS, overlap = OVERLAP_CHARS) {
  if (text.length <= maxChars) return [text];
  const parts = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChars;
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      const lastNewline = text.lastIndexOf("\n", end);
      const breakAt = Math.max(lastNewline, lastSpace, end - 100);
      end = breakAt > start ? breakAt : end;
    }
    parts.push(text.slice(start, end).trim());
    start = end - overlap;
    if (start >= text.length) break;
  }
  return parts;
}

/**
 * Get relative path from docs dir and locale.
 * e.g. getting-started/index.mdx -> { slug: getting-started/, locale: zh-Hant }
 *      en/getting-started/index.mdx -> { slug: en/getting-started/, locale: en }
 */
function pathToSlugAndLocale(relPath) {
  const normalized = relPath.replace(/\\/g, "/");
  if (normalized.startsWith("en/")) {
    const slug = normalized.replace(/\/?index\.mdx?$/, "/").replace(/\.mdx?$/, "/") || "en/";
    return { slug, locale: "en" };
  }
  const slug = normalized.replace(/\/?index\.mdx?$/, "/").replace(/\.mdx?$/, "/") || "";
  return { slug, locale: "zh-Hant" };
}

/**
 * Recursively find all .mdx files under dir.
 */
function findMdxFiles(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const rel = path.join(base, e.name);
    if (e.isDirectory()) {
      files.push(...findMdxFiles(path.join(dir, e.name), rel));
    } else if (e.name.endsWith(".mdx") || e.name.endsWith(".md")) {
      files.push(rel);
    }
  }
  return files;
}

function main() {
  const chunks = [];
  const relPaths = findMdxFiles(DOCS_DIR);

  for (const relPath of relPaths) {
    const fullPath = path.join(DOCS_DIR, relPath);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const body = stripFrontmatter(raw);
    const { slug, locale } = pathToSlugAndLocale(relPath);
    const source = `https://help.kano.site/${slug}`;
    const baseId = (slug.replace(/\/$/, "") || "index").replace(/\//g, "-");

    const sections = splitByHeadings(body);
    if (sections.length === 0 && body.length > 0) {
      const plain = mdToPlainText(body);
      const parts = splitLargeChunk(plain);
      parts.forEach((content, i) => {
        chunks.push({
          id: `${baseId}-${i}`,
          source,
          title: slug,
          content,
          locale,
        });
      });
      continue;
    }

    let chunkIndex = 0;
    for (const { title, content } of sections) {
      const plain = mdToPlainText(title ? `## ${title}\n\n${content}` : content);
      const parts = splitLargeChunk(plain);
      for (const part of parts) {
        chunks.push({
          id: `${baseId}-${chunkIndex}`,
          source,
          title: title || slug,
          content: part,
          locale,
        });
        chunkIndex += 1;
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(chunks, null, 0), "utf-8");
  console.log(`Wrote ${chunks.length} chunks to ${OUT_FILE}`);
}

main();
