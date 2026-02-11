import type { APIRoute } from "astro";

export const prerender = false;

const EMBEDDING_MODEL = "@cf/baai/bge-m3";
const BATCH_SIZE = 20;

interface Chunk {
  id: string;
  source: string;
  title: string;
  content: string;
  locale: string;
}

export const POST = (async ({ request, locals }) => {
  const runtime = locals.runtime as { env: Env } | undefined;
  if (!runtime?.env?.AI || !runtime?.env?.VECTOR_INDEX) {
    return new Response(
      JSON.stringify({ error: "AI 或向量索引未設定。" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const auth = request.headers.get("Authorization");
  const secret = typeof runtime.env.INGEST_SECRET === "string" ? runtime.env.INGEST_SECRET : "";
  if (secret && auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: "未授權" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const chunksUrl = typeof runtime.env.CHUNKS_URL === "string" ? runtime.env.CHUNKS_URL : "https://help.kano.site/chunks.json";
  let chunks: Chunk[];
  try {
    const res = await fetch(chunksUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    chunks = await res.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: `無法取得 chunks：${e instanceof Error ? e.message : String(e)}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!Array.isArray(chunks) || chunks.length === 0) {
    return new Response(JSON.stringify({ ok: true, indexed: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { AI: ai, VECTOR_INDEX: vectorIndex } = runtime.env;
  let indexed = 0;

  try {
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((c) => `${c.title}\n${c.content}`.slice(0, 8000));
      const emb = await ai.run(EMBEDDING_MODEL, { text: texts });
      const data = (emb as { data?: number[][] })?.data;
      if (!data || !Array.isArray(data) || data.length !== batch.length) {
        throw new Error(`Batch embedding failed: got ${data?.length ?? 0} vectors for ${batch.length} chunks`);
      }
      const vectors = batch.map((c, j) => ({
        id: c.id,
        values: data[j]!,
        metadata: {
          title: c.title,
          source: c.source,
          content: c.content.slice(0, 4000),
          locale: c.locale,
        },
      }));
      await vectorIndex.upsert(vectors);
      indexed += vectors.length;
    }

    return new Response(JSON.stringify({ ok: true, indexed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: `ingest failed: ${message}`, indexed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}) satisfies APIRoute;

interface Env {
  AI: Fetcher & { run(model: string, options: unknown): Promise<unknown> };
  VECTOR_INDEX: VectorizeIndex;
  INGEST_SECRET?: string;
  CHUNKS_URL?: string;
}

interface VectorizeIndex {
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
