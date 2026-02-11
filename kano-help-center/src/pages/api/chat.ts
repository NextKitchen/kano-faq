import type { APIRoute } from "astro";

export const prerender = false;

const EMBEDDING_MODEL = "@cf/baai/bge-m3";
const LLM_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const TOP_K = 5;

export const POST = (async ({ request, locals }) => {
  const runtime = locals.runtime as { env: Env } | undefined;
  if (!runtime?.env?.AI || !runtime?.env?.VECTOR_INDEX) {
    return new Response(
      JSON.stringify({ error: "AI 或向量索引未設定，請檢查 Cloudflare 綁定。" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  const { AI: ai, VECTOR_INDEX: vectorIndex } = runtime.env;

  let body: { message?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "請提供有效的 JSON 內容。" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const locale = typeof body?.locale === "string" && (body.locale === "en" || body.locale === "zh-Hant") ? body.locale : "zh-Hant";

  if (!message) {
    return new Response(
      JSON.stringify({ error: "請輸入問題。" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const embeddingResp = await ai.run(EMBEDDING_MODEL, { text: message });
    const values = embeddingResp?.data?.[0];
    if (!values || !Array.isArray(values)) {
      return new Response(
        JSON.stringify({ error: "無法產生查詢向量。" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const query = await vectorIndex.query(values, { topK: TOP_K, returnMetadata: true });
    const matches = query.matches ?? [];
    const contextParts = matches
      .filter((m) => m.metadata && typeof (m.metadata as { locale?: string }).locale === "string")
      .filter((m) => (m.metadata as { locale?: string }).locale === locale)
      .map((m) => {
        const meta = m.metadata as { title?: string; content?: string; source?: string };
        return `【${meta.title ?? "無標題"}】\n${meta.content ?? ""}\n來源：${meta.source ?? ""}`;
      });
    const context = contextParts.length > 0 ? contextParts.join("\n\n---\n\n") : "（目前沒有找到與問題直接相關的說明文件，請嘗試換一種問法或至說明中心搜尋。）";

    const systemPrompt = `你是 Kano 說明中心的 AI 助手。請僅根據以下「說明中心內容」回答使用者的操作問題。若內容中沒有足夠資訊，請誠實說明並建議使用者至 https://help.kano.site 搜尋或聯絡支援。回答請簡潔、友善，並以使用者選擇的語系（繁中或英文）回覆。`;
    const userPrompt = `說明中心內容：\n${context}\n\n使用者問題：${message}`;

    const llmResp = await ai.run(LLM_MODEL, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1024,
    });

    const answer = (llmResp as { response?: string })?.response ?? String(llmResp);
    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "伺服器錯誤";
    return new Response(
      JSON.stringify({ error: `無法取得回覆：${msg}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}) satisfies APIRoute;

interface Env {
  AI: Fetcher & { run(model: string, options: unknown): Promise<unknown> };
  VECTOR_INDEX: VectorizeIndex;
}

interface VectorizeIndex {
  query(vector: number[], options: { topK: number; returnMetadata?: boolean }): Promise<{
    matches?: Array<{ id: string; score?: number; metadata?: Record<string, unknown> }>;
  }>;
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
