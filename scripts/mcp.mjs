#!/usr/bin/env node
/**
 * Minimal client for the Unreal editor's in-editor MCP server.
 *
 * The `mcp__unreal-mcp__*` tools only register if the editor was already running
 * when the Claude Code session started. This script covers the other case — and
 * doubles as the way to check whether the editor is up at all.
 *
 * Usage:
 *   node scripts/mcp.mjs list_toolsets
 *   node scripts/mcp.mjs describe_toolset '{"toolset_name":"EditorToolset.EditorAppToolset"}'
 *   node scripts/mcp.mjs call_tool '{"toolset_name":"...","tool_name":"...","arguments":{}}'
 *
 * Port defaults to 8010 (this project's configured ServerPortNumber, not the
 * engine default of 8000). Override with NEXUS_MCP_PORT.
 *
 * Exits 1 when the editor is not reachable, so callers can branch on it.
 * Only ever talks to 127.0.0.1 — that constraint is what makes it safe to
 * allowlist without a prompt.
 */
import process from 'node:process';

const PORT = process.env.NEXUS_MCP_PORT ?? '8010';
const ENDPOINT = `http://127.0.0.1:${PORT}/mcp`;
const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

/** Responses may be SSE-framed (`event: message` / `data: {...}`); unwrap either shape. */
function parseBody(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return JSON.parse(trimmed);
  for (const line of trimmed.split('\n')) {
    if (line.startsWith('data:')) return JSON.parse(line.slice(5).trim());
  }
  throw new Error(`Unparseable response: ${trimmed.slice(0, 400)}`);
}

async function rpc(body, sessionId) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: sessionId ? {...HEADERS, 'Mcp-Session-Id': sessionId} : HEADERS,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return {response, payload: text ? parseBody(text) : null};
}

const [toolName, rawArgs] = process.argv.slice(2);
if (!toolName) {
  console.error('usage: node scripts/mcp.mjs <tool_name> [args-json]');
  process.exit(1);
}

let toolArgs = {};
if (rawArgs) {
  try {
    toolArgs = JSON.parse(rawArgs);
  } catch (error) {
    console.error(`error: args must be valid JSON — ${error.message}`);
    process.exit(1);
  }
}

let session;
try {
  const {response, payload} = await rpc({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: {name: 'nexus-docs', version: '1.0'},
    },
  });
  session = response.headers.get('Mcp-Session-Id');
  if (payload?.error) throw new Error(JSON.stringify(payload.error));
} catch (error) {
  console.error(
    `error: no MCP server on ${ENDPOINT}.\n` +
      '       The editor is probably not running, or was launched without the\n' +
      '       ModelContextProtocol plugin. See the unreal-mcp skill.\n' +
      `       (${error.message})`,
  );
  process.exit(1);
}

await rpc({jsonrpc: '2.0', method: 'notifications/initialized'}, session);

const {payload} = await rpc(
  {jsonrpc: '2.0', id: 2, method: 'tools/call', params: {name: toolName, arguments: toolArgs}},
  session,
);

if (payload?.error) {
  console.error(`TOOL-ERROR: ${JSON.stringify(payload.error)}`);
  process.exit(1);
}

// Unwrap the usual {result:{content:[{type:'text',text:'...'}]}} envelope so callers
// get the payload rather than the protocol wrapper.
const content = payload?.result?.content;
if (Array.isArray(content)) {
  for (const item of content) {
    if (item.type === 'text') console.log(item.text);
    else console.log(JSON.stringify(item));
  }
  if (payload.result.isError) process.exit(1);
} else {
  console.log(JSON.stringify(payload?.result ?? payload, null, 2));
}
