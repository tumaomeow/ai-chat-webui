const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_JSON_BODY = 128 * 1024 * 1024;
const MAX_FILE_BODY = 70 * 1024 * 1024;

const DEEPSEEK_CHAT_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_FILES_URL = 'https://api.deepseek.com/files';
const ARK_IMAGE_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const ARK_TASKS_URL = 'https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks';

const DEEPSEEK_MODELS = new Set(['deepseek-flash', 'deepseek-v4-pro']);

// 官方模型页给出的 Model ID 是不带版本后缀的基础 ID；带版本的 ID 保留为兼容别名。
const SEEDREAM_5_FLASH = {
  name: 'Seedream 5.0 Flash',
  sizes: ['1K', '1.5K', '2K'],
  defaultSize: '2K',
  maxRefs: 10,
  outputFormat: 'png',
  supportsSequential: false,
};
const SEEDREAM_5_PRO = {
  name: 'Seedream 5.0 Pro',
  sizes: ['1K', '1.5K', '2K'],
  defaultSize: '2K',
  maxRefs: 10,
  outputFormat: 'png',
  supportsSequential: false,
};
const SEEDREAM_5_LITE = {
  name: 'Seedream 5.0 Lite',
  sizes: ['2K', '3K', '4K'],
  defaultSize: '2K',
  maxRefs: 14,
  outputFormat: 'png',
  supportsSequential: true,
};
const SEEDREAM_4_5 = {
  name: 'Seedream 4.5',
  sizes: ['2K', '4K'],
  defaultSize: '2K',
  maxRefs: 14,
  // 4.5 固定输出 JPEG，官方接口不接受 output_format 参数
  outputFormat: null,
  supportsSequential: true,
};
const SEEDREAM_4_0 = {
  name: 'Seedream 4.0',
  sizes: ['1K', '2K', '4K'],
  defaultSize: '2K',
  maxRefs: 14,
  // 4.0 固定输出 JPEG，官方接口不接受 output_format 参数
  outputFormat: null,
  supportsSequential: true,
};

const ARK_MODELS = {
  'doubao-seedream-5-0-flash': SEEDREAM_5_FLASH,
  'doubao-seedream-5-0-pro': SEEDREAM_5_PRO,
  'doubao-seedream-5-0': SEEDREAM_5_LITE,
  'doubao-seedream-4-5': SEEDREAM_4_5,
  'doubao-seedream-4-0': SEEDREAM_4_0,
  // 旧版/带版本号的 ID 仅用于兼容历史对话和直接调用
  'doubao-seedream-5-0-flash-260915': SEEDREAM_5_FLASH,
  'doubao-seedream-5-0-pro-260628': SEEDREAM_5_PRO,
  'doubao-seedream-5-0-lite-260128': SEEDREAM_5_LITE,
  'doubao-seedream-5-0-260128': SEEDREAM_5_LITE,
  'doubao-seedream-4-5-251128': SEEDREAM_4_5,
  'doubao-seedream-4-0-20260415': SEEDREAM_4_0,
  'doubao-seedream-4-0-250828': SEEDREAM_4_0,
};

const ARK_TASK_MODELS = new Set([
  'doubao-seedance-1-0-pro-250528',
  'doubao-seedance-1-0-pro-fast-251015',
  'doubao-seed3d-2-0-260328',
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-DeepSeek-Key',
};

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...CORS,
  });
  res.end(body);
}

function collectBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('请求体过大'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJsonBody(req) {
  const raw = await collectBody(req, MAX_JSON_BODY);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch (error) {
    throw new Error('请求体不是合法的 JSON');
  }
}

function serveStatic(req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (error) {
    res.writeHead(400, CORS);
    return res.end('Bad Request');
  }
  if (pathname === '/') pathname = '/index.html';

  const resolved = path.resolve(PUBLIC_DIR, '.' + path.normalize(pathname));
  if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== PUBLIC_DIR) {
    res.writeHead(403, CORS);
    return res.end('Forbidden');
  }

  fs.readFile(resolved, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...CORS });
      return res.end('Not Found');
    }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', ...CORS });
    res.end(data);
  });
}

function messagesContainFileBlocks(messages) {
  return messages.some(
    (message) =>
      Array.isArray(message.content) &&
      message.content.some((block) => block && (block.type === 'file' || block.type === 'image_url'))
  );
}

async function handleDeepSeekChat(req, res, body) {
  const apiKey = String(body.apiKey || '').trim();
  const model = String(body.model || 'deepseek-flash');
  const messages = body.messages;

  if (!apiKey) {
    return sendJson(res, 400, { error: { message: '请先在设置中填写 DeepSeek API Key' } });
  }
  if (!DEEPSEEK_MODELS.has(model)) {
    return sendJson(res, 400, { error: { message: '不支持的 DeepSeek 模型：' + model } });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return sendJson(res, 400, { error: { message: '缺少 messages 参数' } });
  }
  if (model === 'deepseek-v4-pro' && messagesContainFileBlocks(messages)) {
    return sendJson(res, 400, {
      error: {
        message: 'DeepSeek V4 Pro 官方不支持图片/文件输入，请切换到 DeepSeek Flash。',
      },
    });
  }

  const payload = {
    model,
    messages,
    stream: true,
    reasoning_effort: 'none',
  };

  let upstream;
  try {
    upstream = await fetch(DEEPSEEK_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return sendJson(res, 502, { error: { message: '无法连接 DeepSeek 接口：' + error.message } });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    res.writeHead(upstream.status, { 'Content-Type': 'application/json; charset=utf-8', ...CORS });
    return res.end(
      text || JSON.stringify({ error: { message: 'DeepSeek 返回错误 ' + upstream.status } })
    );
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
    ...CORS,
  });

  try {
    for await (const chunk of upstream.body) {
      res.write(chunk);
    }
  } catch (error) {
    // 客户端断开时静默结束
  }
  res.end();
}

async function handleDeepSeekFile(req, res) {
  const apiKey = String(req.headers['x-deepseek-key'] || '').trim();
  const contentType = String(req.headers['content-type'] || '');

  if (!apiKey) {
    return sendJson(res, 400, { error: { message: '请先在设置中填写 DeepSeek API Key' } });
  }
  if (!contentType.startsWith('multipart/form-data')) {
    return sendJson(res, 400, { error: { message: '文件上传必须使用 multipart/form-data' } });
  }

  let fileBody;
  try {
    fileBody = await collectBody(req, MAX_FILE_BODY);
  } catch (error) {
    return sendJson(res, 413, { error: { message: '文件过大，DeepSeek 单文件上限为 64 MiB' } });
  }

  let upstream;
  try {
    upstream = await fetch(DEEPSEEK_FILES_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': contentType,
      },
      body: fileBody,
    });
  } catch (error) {
    return sendJson(res, 502, { error: { message: '无法连接 DeepSeek 文件接口：' + error.message } });
  }

  const text = await upstream.text().catch(() => '');
  res.writeHead(upstream.status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS,
  });
  res.end(
    text || JSON.stringify({ error: { message: 'DeepSeek 文件接口返回错误 ' + upstream.status } })
  );
}

async function handleArkImage(req, res, body) {
  const apiKey = String(body.apiKey || '').trim();
  const prompt = String(body.prompt || '').trim();
  const model = String(body.model || 'doubao-seedream-5-0-flash');
  const config = ARK_MODELS[model];

  if (!apiKey) {
    return sendJson(res, 400, { error: { message: '请先在设置中填写火山方舟 API Key' } });
  }
  if (!config) {
    return sendJson(res, 400, { error: { message: '不支持的火山方舟模型：' + model } });
  }
  if (!prompt) {
    return sendJson(res, 400, { error: { message: '请输入生成图片的提示词' } });
  }

  const size = config.sizes.includes(body.size) ? body.size : config.defaultSize;
  const payload = {
    model,
    prompt,
    size,
    response_format: 'b64_json',
    watermark: false,
  };
  if (config.outputFormat) payload.output_format = config.outputFormat;

  if (body.image) {
    const refs = (Array.isArray(body.image) ? body.image : [body.image])
      .filter((item) => typeof item === 'string' && item.length > 0)
      .slice(0, config.maxRefs);
    if (refs.length === 1) payload.image = refs[0];
    if (refs.length > 1) payload.image = refs;
  }

  if (config.supportsSequential) {
    if (body.mode === 'group') {
      const requested = Number(body.maxImages) || 4;
      const refsCount = payload.image
        ? Array.isArray(payload.image)
          ? payload.image.length
          : 1
        : 0;
      const maxImages = Math.max(1, Math.min(15, requested, 15 - refsCount));
      payload.sequential_image_generation = 'auto';
      payload.sequential_image_generation_options = { max_images: maxImages };
    } else {
      payload.sequential_image_generation = 'disabled';
    }
  }

  let upstream;
  try {
    upstream = await fetch(ARK_IMAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return sendJson(res, 502, { error: { message: '无法连接火山方舟接口：' + error.message } });
  }

  const text = await upstream.text().catch(() => '');
  res.writeHead(upstream.status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS,
  });
  res.end(
    text || JSON.stringify({ error: { message: '火山方舟返回错误 ' + upstream.status } })
  );
}

async function handleArkTaskCreate(req, res, body) {
  const apiKey = String(body.apiKey || '').trim();
  const payload = body.payload;

  if (!apiKey) {
    return sendJson(res, 400, { error: { message: '请先在设置中填写火山方舟 API Key' } });
  }
  if (!payload || typeof payload !== 'object') {
    return sendJson(res, 400, { error: { message: '缺少任务 payload' } });
  }
  if (!ARK_TASK_MODELS.has(String(payload.model || ''))) {
    return sendJson(res, 400, { error: { message: '不支持的异步任务模型：' + payload.model } });
  }
  if (!Array.isArray(payload.content) || payload.content.length === 0) {
    return sendJson(res, 400, { error: { message: '任务 content 不能为空' } });
  }

  let upstream;
  try {
    upstream = await fetch(ARK_TASKS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return sendJson(res, 502, { error: { message: '无法连接火山方舟任务接口：' + error.message } });
  }

  const text = await upstream.text().catch(() => '');
  res.writeHead(upstream.status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS,
  });
  res.end(
    text || JSON.stringify({ error: { message: '火山方舟任务接口返回错误 ' + upstream.status } })
  );
}

async function handleArkTaskQuery(req, res, body) {
  const apiKey = String(body.apiKey || '').trim();
  const taskId = String(body.taskId || '').trim();

  if (!apiKey) {
    return sendJson(res, 400, { error: { message: '请先在设置中填写火山方舟 API Key' } });
  }
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(taskId)) {
    return sendJson(res, 400, { error: { message: '任务 ID 不合法' } });
  }

  let upstream;
  try {
    upstream = await fetch(ARK_TASKS_URL + '/' + encodeURIComponent(taskId), {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + apiKey },
    });
  } catch (error) {
    return sendJson(res, 502, { error: { message: '无法连接火山方舟任务接口：' + error.message } });
  }

  const text = await upstream.text().catch(() => '');
  res.writeHead(upstream.status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS,
  });
  res.end(
    text || JSON.stringify({ error: { message: '火山方舟任务接口返回错误 ' + upstream.status } })
  );
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }

  const pathname = (() => {
    try {
      return new URL(req.url, 'http://localhost').pathname;
    } catch (error) {
      return req.url;
    }
  })();

  if (req.method === 'POST' && pathname === '/api/deepseek/chat') {
    try {
      const body = await readJsonBody(req);
      await handleDeepSeekChat(req, res, body);
    } catch (error) {
      if (!res.headersSent) sendJson(res, 400, { error: { message: error.message } });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/deepseek/file') {
    try {
      await handleDeepSeekFile(req, res);
    } catch (error) {
      if (!res.headersSent) sendJson(res, 400, { error: { message: error.message } });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/ark/image') {
    try {
      const body = await readJsonBody(req);
      await handleArkImage(req, res, body);
    } catch (error) {
      if (!res.headersSent) sendJson(res, 400, { error: { message: error.message } });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/ark/tasks') {
    try {
      const body = await readJsonBody(req);
      await handleArkTaskCreate(req, res, body);
    } catch (error) {
      if (!res.headersSent) sendJson(res, 400, { error: { message: error.message } });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/ark/tasks/query') {
    try {
      const body = await readJsonBody(req);
      await handleArkTaskQuery(req, res, body);
    } catch (error) {
      if (!res.headersSent) sendJson(res, 400, { error: { message: error.message } });
    }
    return;
  }

  if (req.method === 'GET') {
    return serveStatic(req, res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...CORS });
  res.end('Not Found');
});

server.listen(PORT, HOST, () => {
  console.log('AI 工作台已启动： http://' + HOST + ':' + PORT);
});
