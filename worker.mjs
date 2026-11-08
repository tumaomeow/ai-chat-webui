import { Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import serverModule from './server.js';

const API_PREFIX = '/api/';
const MAX_WORKER_BODY = 90 * 1024 * 1024;

function corsHeaders(request) {
  return {
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-DeepSeek-Key',
  };
}

function jsonError(request, status, message) {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(request),
    },
  });
}

/**
 * 把 Web Request 适配成 Node 风格的 req。
 * 现有 server.js 的读取逻辑只依赖 data/end/error 事件和 headers/method/url。
 */
function createNodeRequest(request) {
  const nodeReq = new EventEmitter();
  const url = new URL(request.url);
  let reader = null;

  nodeReq.method = request.method;
  nodeReq.url = url.pathname + url.search;
  nodeReq.headers = Object.fromEntries(request.headers.entries());
  nodeReq.destroy = () => {
    if (reader) reader.cancel().catch(() => {});
  };

  queueMicrotask(async () => {
    try {
      if (request.body) {
        reader = request.body.getReader();
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          if (chunk.value && chunk.value.byteLength) {
            nodeReq.emit('data', Buffer.from(chunk.value));
          }
        }
      }
      nodeReq.emit('end');
    } catch (error) {
      nodeReq.emit('error', error);
    }
  });

  return nodeReq;
}

/**
 * 把现有 server.js 的 res 调用收集成 Web Response。
 * 这样 API 业务逻辑不需要改写。
 */
function createNodeResponse() {
  let resolveResponse;
  const responsePromise = new Promise((resolve) => {
    resolveResponse = resolve;
  });

  let status = 200;
  let headers = {};
  let headersSent = false;
  let ended = false;
  const chunks = [];

  const res = {
    get headersSent() {
      return headersSent;
    },
    get statusCode() {
      return status;
    },
    set statusCode(value) {
      status = value;
    },
    setHeader(name, value) {
      headers[name] = value;
    },
    getHeader(name) {
      return headers[name];
    },
    writeHead(code, nextHeaders = {}) {
      if (!headersSent) {
        status = code;
        headers = { ...headers, ...nextHeaders };
        headersSent = true;
      }
      return res;
    },
    write(chunk) {
      if (ended || chunk === undefined) return false;
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return true;
    },
    end(chunk) {
      if (ended) return;
      if (chunk !== undefined && typeof chunk !== 'function') {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      ended = true;
      headersSent = true;
      resolveResponse(new Response(Buffer.concat(chunks), { status, headers }));
    },
  };

  return { res, responsePromise };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (!url.pathname.startsWith(API_PREFIX)) {
      if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
        return new Response('Static assets binding is not configured.', { status: 500 });
      }
      return env.ASSETS.fetch(request);
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_WORKER_BODY) {
      return jsonError(request, 413, '请求体超过 Cloudflare Worker 当前限制');
    }

    const nodeReq = createNodeRequest(request);
    const { res, responsePromise } = createNodeResponse();

    try {
      await serverModule.handleRequest(nodeReq, res);
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: { message: error.message || 'Worker 内部错误' } }));
      }
    }

    return responsePromise;
  },
};
