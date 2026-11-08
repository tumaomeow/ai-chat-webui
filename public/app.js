'use strict';

const $ = (sel, root = document) => root.querySelector(sel);

const PLATFORMS = {
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '✦',
    defaultModel: 'deepseek-flash',
    models: ['deepseek-flash', 'deepseek-v4-pro'],
  },
  ark: {
    id: 'ark',
    name: '火山方舟',
    icon: '◈',
    defaultModel: 'doubao-seedream-5-0-flash',
    models: [
      'doubao-seedream-5-0-flash',
      'doubao-seedream-5-0-pro',
      'doubao-seedream-5-0',
      'doubao-seedream-4-5',
      'doubao-seedream-4-0',
      'doubao-seedance-1-0-pro-250528',
      'doubao-seedance-1-0-pro-fast-251015',
      'doubao-seed3d-2-0-260328',
    ],
  },
};

const MODELS = {
  'deepseek-flash': {
    id: 'deepseek-flash',
    platform: 'deepseek',
    name: 'DeepSeek Flash',
    modelId: 'deepseek-flash',
    icon: '✦',
    kind: 'chat',
    supportsFiles: true,
    fileFormats: 'JPEG / PNG / GIF / WebP',
    placeholder: '输入消息，可上传文件（JPEG / PNG / GIF / WebP）…',
    emptyTitle: '有什么想聊的？',
    emptyDesc: 'DeepSeek Flash 支持文字对话与文件理解。',
    suggestions: ['帮我总结一份资料', '解释这张图里的内容', '写一个产品文案'],
  },
  'deepseek-v4-pro': {
    id: 'deepseek-v4-pro',
    platform: 'deepseek',
    name: 'DeepSeek V4 Pro',
    modelId: 'deepseek-v4-pro',
    icon: '◇',
    kind: 'chat',
    supportsFiles: false,
    placeholder: '输入消息…',
    emptyTitle: '开始一段深度对话',
    emptyDesc: 'DeepSeek V4 Pro 适合更复杂的文本任务，官方不支持文件输入。',
    suggestions: ['分析一个复杂问题', '写一份技术方案', '帮我梳理思路'],
  },
  'doubao-seedream-5-0-flash': {
    id: 'doubao-seedream-5-0-flash',
    platform: 'ark',
    name: 'Seedream 5.0 Flash',
    modelId: 'doubao-seedream-5-0-flash',
    icon: '🎨',
    kind: 'image',
    sizes: ['1K', '1.5K', '2K'],
    defaultSize: '2K',
    maxRefs: 10,
    outputFormat: 'png',
    versionOptions: [
      { value: 'doubao-seedream-5-0-flash-260915', label: '260915（官方推荐）' },
      { value: 'doubao-seedream-5-0-flash', label: '基础 ID' },
    ],
    defaultVersion: 'doubao-seedream-5-0-flash-260915',
    placeholder: '描述你想要生成的图片…',
    emptyTitle: '把想象画出来',
    emptyDesc: '描述画面，Seedream 5.0 Flash 会生成一张图片。',
    suggestions: ['赛博朋克城市夜景，霓虹灯倒影', '水彩风格的山谷与晨雾', '极简产品海报，留白构图'],
  },
  'doubao-seedream-5-0-pro': {
    id: 'doubao-seedream-5-0-pro',
    platform: 'ark',
    name: 'Seedream 5.0 Pro',
    modelId: 'doubao-seedream-5-0-pro',
    icon: '🎨',
    kind: 'image',
    sizes: ['1K', '1.5K', '2K'],
    defaultSize: '2K',
    maxRefs: 10,
    outputFormat: 'png',
    versionOptions: [
      { value: 'doubao-seedream-5-0-pro-260628', label: '260628（官方推荐）' },
      { value: 'doubao-seedream-5-0-pro', label: '基础 ID' },
    ],
    defaultVersion: 'doubao-seedream-5-0-pro-260628',
    placeholder: '描述你想要生成的图片…',
    emptyTitle: '更高完成度的画面',
    emptyDesc: 'Seedream 5.0 Pro 适合更精细的图片生成与编辑。',
    suggestions: ['电影感人物肖像，柔和侧光', '高级产品海报，极简构图', '幻想森林中的发光城堡'],
  },
  'doubao-seedream-5-0': {
    id: 'doubao-seedream-5-0',
    platform: 'ark',
    name: 'Seedream 5.0 Lite',
    modelId: 'doubao-seedream-5-0',
    icon: '🎨',
    kind: 'image',
    sizes: ['2K', '3K', '4K'],
    defaultSize: '2K',
    maxRefs: 14,
    outputFormat: 'png',
    supportsSequential: true,
    versionOptions: [
      { value: 'doubao-seedream-5-0-260128', label: '260128（官方推荐）' },
      { value: 'doubao-seedream-5-0', label: '基础 ID' },
      { value: 'doubao-seedream-5-0-lite-260128', label: 'Lite 别名' },
    ],
    defaultVersion: 'doubao-seedream-5-0-260128',
    placeholder: '描述你想要生成的图片…',
    emptyTitle: '高分辨率图片生成',
    emptyDesc: 'Seedream 5.0 Lite 支持 2K / 3K / 4K 输出。',
    suggestions: ['4K 风景摄影，雪山与湖泊', '未来城市全景，电影级光影', '品牌视觉海报，现代排版'],
  },
  'doubao-seedream-4-5': {
    id: 'doubao-seedream-4-5',
    platform: 'ark',
    name: 'Seedream 4.5',
    modelId: 'doubao-seedream-4-5',
    icon: '🎨',
    kind: 'image',
    sizes: ['2K', '4K'],
    defaultSize: '2K',
    maxRefs: 14,
    outputFormat: 'jpeg',
    supportsSequential: true,
    versionOptions: [
      { value: 'doubao-seedream-4-5-251128', label: '251128（官方推荐）' },
      { value: 'doubao-seedream-4-5', label: '基础 ID' },
    ],
    defaultVersion: 'doubao-seedream-4-5-251128',
    placeholder: '描述你想要生成的图片…',
    emptyTitle: '经典 Seedream 4.5',
    emptyDesc: '支持文生图、单图生图与多图参考。',
    suggestions: ['复古胶片风格街景', '多图融合的服装穿搭', '童话绘本插画'],
  },
  'doubao-seedream-4-0': {
    id: 'doubao-seedream-4-0',
    platform: 'ark',
    name: 'Seedream 4.0',
    modelId: 'doubao-seedream-4-0',
    icon: '🎨',
    kind: 'image',
    sizes: ['1K', '2K', '4K'],
    defaultSize: '2K',
    maxRefs: 14,
    outputFormat: 'jpeg',
    supportsSequential: true,
    versionOptions: [
      { value: 'doubao-seedream-4-0-20260415', label: '20260415（最新）' },
      { value: 'doubao-seedream-4-0-250828', label: '250828（旧版）' },
    ],
    defaultVersion: 'doubao-seedream-4-0-20260415',
    placeholder: '描述你想要生成的图片…',
    emptyTitle: 'Seedream 4.0',
    emptyDesc: '支持文生图、单图生图与多图参考。',
    suggestions: ['新中式室内设计效果图', '卡通角色三视图', '电商产品场景图'],
  },
  'doubao-seedance-1-0-pro-250528': {
    id: 'doubao-seedance-1-0-pro-250528',
    platform: 'ark',
    name: 'Seedance 1.0 Pro',
    modelId: 'doubao-seedance-1-0-pro-250528',
    icon: '▶',
    kind: 'video',
    resolutionOptions: ['480p', '720p', '1080p'],
    defaultResolution: '720p',
    ratioOptions: ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
    defaultRatio: '16:9',
    durationOptions: [5, 10],
    defaultDuration: 5,
    maxRefs: 1,
    refRequired: false,
    refLabel: '首帧图',
    placeholder: '描述你想生成的视频画面…',
    emptyTitle: '让画面动起来',
    emptyDesc: '输入提示词，可选用一张首帧图，Seedance 会生成视频。',
    suggestions: ['海边日落，镜头缓慢推进', '雨夜霓虹街道，电影感运镜', '小猫在窗边看雨，温暖光线'],
  },
  'doubao-seedance-1-0-pro-fast-251015': {
    id: 'doubao-seedance-1-0-pro-fast-251015',
    platform: 'ark',
    name: 'Seedance 1.0 Pro Fast',
    modelId: 'doubao-seedance-1-0-pro-fast-251015',
    icon: '⚡',
    kind: 'video',
    resolutionOptions: ['480p', '720p', '1080p'],
    defaultResolution: '720p',
    ratioOptions: ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
    defaultRatio: '16:9',
    durationOptions: [5, 10],
    defaultDuration: 5,
    maxRefs: 1,
    refRequired: false,
    refLabel: '首帧图',
    placeholder: '描述你想生成的视频画面…',
    emptyTitle: '更快地生成视频',
    emptyDesc: 'Seedance 1.0 Pro Fast 在速度与成本之间取得平衡。',
    suggestions: ['城市延时摄影，云层流动', '咖啡倒入杯中，慢动作特写', '森林小径，阳光穿过树叶'],
  },
  'doubao-seed3d-2-0-260328': {
    id: 'doubao-seed3d-2-0-260328',
    platform: 'ark',
    name: 'Seed3D 2.0',
    modelId: 'doubao-seed3d-2-0-260328',
    icon: '⬡',
    kind: '3d',
    fileFormatOptions: ['glb', 'obj', 'usd', 'usdz'],
    defaultFileFormat: 'glb',
    subdivisionOptions: [
      { value: 'low', label: '10 万面' },
      { value: 'medium', label: '50 万面' },
      { value: 'high', label: '100 万面' },
    ],
    defaultSubdivision: 'medium',
    maxRefs: 1,
    refRequired: true,
    refLabel: '参考图',
    placeholder: '3D 模式：请上传一张参考图',
    emptyTitle: '把图片变成 3D 资产',
    emptyDesc: '上传一张图片，Seed3D 2.0 会生成可下载的 3D 模型。',
    suggestions: [],
  },
};

const els = {
  chat: $('#chat'),
  input: $('#input'),
  sendBtn: $('#sendBtn'),
  attachBtn: $('#attachBtn'),
  attachLabel: $('#attachLabel'),
  attachPreview: $('#attachPreview'),
  fileInput: $('#fileInput'),
  platformSwitch: $('#platformSwitch'),
  modelSelect: $('#modelSelect'),
  paramFields: $('#paramFields'),
  modelNote: $('#modelNote'),
  hint: $('#hint'),
  convTitle: $('#convTitle'),
  modelChip: $('#modelChip'),
  sidebar: $('#sidebar'),
  sidebarOverlay: $('#sidebarOverlay'),
  platformList: $('#platformList'),
  menuBtn: $('#menuBtn'),
  newChatBtn: $('#newChatBtn'),
  themeBtn: $('#themeBtn'),
  settingsBtn: $('#settingsBtn'),
  settingsModal: $('#settingsModal'),
  closeSettingsBtn: $('#closeSettings'),
  deepseekKey: $('#deepseekKey'),
  arkKey: $('#arkKey'),
  toast: $('#toast'),
};

let conversations = [];
let activeId = null;
let attachments = [];
const runningConversations = new Set();
let collapsedPlatforms = { deepseek: false, ark: false };
let collapsedModels = {};
let toastTimer = null;
let storageWarnedAt = 0;

/* ================= 基础工具 ================= */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMarkdown(value) {
  return value
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderMarkdown(source) {
  if (!source) return '';
  const codeBlocks = [];
  let text = String(source).replace(/```([\s\S]*?)```/g, (match, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(code.replace(/^\n+|\n+$/g, ''));
    return '\u0000CODE' + index + '\u0000';
  });
  text = escapeHtml(text);

  const output = [];
  let listTag = null;
  let listItems = [];

  function flushList() {
    if (!listTag) return;
    output.push('<' + listTag + '>' + listItems.join('') + '</' + listTag + '>');
    listTag = null;
    listItems = [];
  }

  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      output.push('<br>');
      continue;
    }

    const codeMatch = trimmed.match(/^\u0000CODE(\d+)\u0000$/);
    if (codeMatch) {
      flushList();
      output.push('\u0000CODE' + codeMatch[1] + '\u0000');
      continue;
    }

    const unordered = line.match(/^\s*[-*+•·▪◦●]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.、)]\s*(.+)$/);
    if (unordered || ordered) {
      const tag = unordered ? 'ul' : 'ol';
      if (listTag !== tag) {
        flushList();
        listTag = tag;
      }
      listItems.push('<li>' + inlineMarkdown((unordered || ordered)[1]) + '</li>');
      continue;
    }

    flushList();

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length + 1;
      output.push('<h' + level + '>' + inlineMarkdown(heading[2]) + '</h' + level + '>');
      continue;
    }

    output.push(inlineMarkdown(trimmed) + '<br>');
  }
  flushList();

  return output
    .join('')
    .replace(/\u0000CODE(\d+)\u0000/g, (match, index) => {
      return '<pre><code>' + escapeHtml(codeBlocks[Number(index)]) + '</code></pre>';
    });
}

function truncate(text, max) {
  const value = String(text || '').trim();
  return value.length > max ? value.slice(0, max) + '…' : value;
}

function formatBytes(bytes) {
  if (!bytes) return '';
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return mb.toFixed(1) + ' MiB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KiB';
}

function scrollToBottom() {
  els.chat.scrollTop = els.chat.scrollHeight;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  requestAnimationFrame(() => els.toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
    setTimeout(() => {
      els.toast.hidden = true;
    }, 220);
  }, 2400);
}

function modelMeta(modelId) {
  return MODELS[modelId] || MODELS['deepseek-flash'];
}

function platformMeta(platformId) {
  return PLATFORMS[platformId] || PLATFORMS.deepseek;
}

function kindLabel(kind) {
  if (kind === 'image') return '图片';
  if (kind === 'video') return '视频';
  if (kind === '3d') return '3D';
  return '对话';
}

function kindClass(kind) {
  if (kind === 'video') return 'video';
  if (kind === '3d') return 'three-d';
  return '';
}

function defaultParams(meta) {
  if (meta.kind === 'image') {
    const params = { size: meta.defaultSize };
    if (meta.versionOptions) params.version = meta.defaultVersion;
    if (meta.supportsSequential) {
      params.mode = 'single';
      params.maxImages = 4;
    }
    return params;
  }
  if (meta.kind === 'video') {
    return {
      resolution: meta.defaultResolution,
      ratio: meta.defaultRatio,
      duration: meta.defaultDuration,
    };
  }
  if (meta.kind === '3d') {
    return {
      fileFormat: meta.defaultFileFormat,
      subdivision: meta.defaultSubdivision,
    };
  }
  return {};
}

function normalizeParams(meta, params = {}) {
  const defaults = defaultParams(meta);
  if (meta.kind === 'image') {
    const result = {
      size: meta.sizes.includes(params.size) ? params.size : defaults.size,
    };
    if (meta.versionOptions) {
      result.version = meta.versionOptions.some((item) => item.value === params.version)
        ? params.version
        : meta.defaultVersion;
    }
    if (meta.supportsSequential) {
      result.mode = params.mode === 'group' ? 'group' : 'single';
      const maxImages = Number(params.maxImages);
      result.maxImages =
        Number.isInteger(maxImages) && maxImages >= 1 && maxImages <= 15
          ? maxImages
          : defaults.maxImages;
    }
    return result;
  }
  if (meta.kind === 'video') {
    const duration = Number(params.duration);
    return {
      resolution: meta.resolutionOptions.includes(params.resolution)
        ? params.resolution
        : defaults.resolution,
      ratio: meta.ratioOptions.includes(params.ratio) ? params.ratio : defaults.ratio,
      duration: meta.durationOptions.includes(duration) ? duration : defaults.duration,
    };
  }
  if (meta.kind === '3d') {
    return {
      fileFormat: meta.fileFormatOptions.includes(params.fileFormat)
        ? params.fileFormat
        : defaults.fileFormat,
      subdivision: meta.subdivisionOptions.some((item) => item.value === params.subdivision)
        ? params.subdivision
        : defaults.subdivision,
    };
  }
  return {};
}

function paramDefinitions(meta, params) {
  if (meta.kind === 'image') {
    const definitions = [
      {
        key: 'size',
        label: '尺寸',
        value: params.size,
        options: meta.sizes.map((size) => ({ value: size, label: size })),
      },
    ];
    if (meta.versionOptions) {
      definitions.unshift({
        key: 'version',
        label: '版本',
        value: params.version,
        options: meta.versionOptions,
      });
    }
    if (meta.supportsSequential) {
      definitions.push({
        key: 'mode',
        label: '输出',
        value: params.mode,
        options: [
          { value: 'single', label: '单图' },
          { value: 'group', label: '组图' },
        ],
      });
      if (params.mode === 'group') {
        definitions.push({
          key: 'maxImages',
          label: '最多',
          value: String(params.maxImages),
          options: [1, 2, 4, 6, 8, 10, 15].map((value) => ({
            value: String(value),
            label: value + ' 张',
          })),
        });
      }
    }
    return definitions;
  }
  if (meta.kind === 'video') {
    return [
      {
        key: 'resolution',
        label: '分辨率',
        value: params.resolution,
        options: meta.resolutionOptions.map((value) => ({ value, label: value })),
      },
      {
        key: 'ratio',
        label: '比例',
        value: params.ratio,
        options: meta.ratioOptions.map((value) => ({ value, label: value })),
      },
      {
        key: 'duration',
        label: '时长',
        value: String(params.duration),
        options: meta.durationOptions.map((value) => ({
          value: String(value),
          label: value + ' 秒',
        })),
      },
    ];
  }
  if (meta.kind === '3d') {
    return [
      {
        key: 'fileFormat',
        label: '格式',
        value: params.fileFormat,
        options: meta.fileFormatOptions.map((value) => ({
          value,
          label: value.toUpperCase(),
        })),
      },
      {
        key: 'subdivision',
        label: '面数',
        value: params.subdivision,
        options: meta.subdivisionOptions,
      },
    ];
  }
  return [];
}

/* ================= IndexedDB ================= */

const DB_NAME = 'aichat-webui';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';
let dbPromise = null;

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('当前浏览器不支持 IndexedDB'));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

async function dbGetAll() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function dbPut(conversation) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(conversation);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function handleStorageError(error) {
  console.warn('本地保存失败', error);
  if (Date.now() - storageWarnedAt < 8000) return;
  storageWarnedAt = Date.now();
  showToast('本地保存失败，浏览器存储空间可能不足');
}

async function persist(conversation) {
  try {
    await dbPut(conversation);
  } catch (error) {
    handleStorageError(error);
  }
}

/* ================= 主题 ================= */

function setTheme(theme, save = true) {
  document.documentElement.dataset.theme = theme;
  els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  els.themeBtn.title = theme === 'dark' ? '切换为浅色主题' : '切换为深色主题';
  if (save) {
    try {
      localStorage.setItem('aichat-theme', theme);
    } catch (error) {
      console.warn('主题保存失败', error);
    }
  }
}

function initTheme() {
  let theme = 'light';
  try {
    theme = localStorage.getItem('aichat-theme') || '';
  } catch (error) {
    theme = '';
  }
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(theme, false);
}

/* ================= API Key ================= */

function loadKeys() {
  try {
    els.deepseekKey.value = localStorage.getItem('deepseekApiKey') || '';
    els.arkKey.value = localStorage.getItem('arkApiKey') || '';
  } catch (error) {
    console.warn('读取 API Key 失败', error);
  }
}

function saveKeys() {
  try {
    localStorage.setItem('deepseekApiKey', els.deepseekKey.value.trim());
    localStorage.setItem('arkApiKey', els.arkKey.value.trim());
  } catch (error) {
    console.warn('保存 API Key 失败', error);
  }
}

function getKey(platform) {
  return platform === 'ark' ? els.arkKey.value.trim() : els.deepseekKey.value.trim();
}

function openSettings() {
  els.settingsModal.hidden = false;
  setTimeout(() => els.deepseekKey.focus(), 40);
}

function closeSettings() {
  saveKeys();
  els.settingsModal.hidden = true;
}

/* ================= 会话数据 ================= */

function normalizeConversation(item) {
  let platform = item.platform;
  let model = item.model;

  if (model === 'deepseek') {
    platform = 'deepseek';
    model = 'deepseek-flash';
  } else if (model === 'seedream') {
    platform = 'ark';
    model = 'doubao-seedream-5-0-flash';
  } else if (model === 'doubao-seedream-5-0-flash-260915') {
    platform = 'ark';
    model = 'doubao-seedream-5-0-flash';
  } else if (model === 'doubao-seedream-5-0-pro-260628') {
    platform = 'ark';
    model = 'doubao-seedream-5-0-pro';
  } else if (
    model === 'doubao-seedream-5-0-lite-260128' ||
    model === 'doubao-seedream-5-0-260128'
  ) {
    platform = 'ark';
    model = 'doubao-seedream-5-0';
  } else if (model === 'doubao-seedream-4-5-251128') {
    platform = 'ark';
    model = 'doubao-seedream-4-5';
  } else if (model === 'doubao-seedream-4-0-250828') {
    platform = 'ark';
    model = 'doubao-seedream-4-0';
  } else if (
    model === 'doubao-seedream-4-0-20260415' ||
    model === 'doubao-seedream-4-0-260415'
  ) {
    platform = 'ark';
    model = 'doubao-seedream-4-0';
  }

  if (!MODELS[model]) {
    platform = platform && PLATFORMS[platform] ? platform : 'deepseek';
    model = platformMeta(platform).defaultModel;
  }
  if (!platform || !PLATFORMS[platform]) {
    platform = MODELS[model].platform;
  }

  const meta = MODELS[model];
  const params = normalizeParams(meta, item.params || { size: item.size });
  return {
    ...item,
    platform,
    model,
    params,
    messages: Array.isArray(item.messages) ? item.messages : [],
  };
}

function currentConversation() {
  return conversations.find((item) => item.id === activeId) || null;
}

function currentModel() {
  const conversation = currentConversation();
  return conversation ? conversation.model : 'deepseek-flash';
}

function loadCollapsed() {
  try {
    const saved = JSON.parse(localStorage.getItem('aichat-collapsed-v2') || '{}');
    collapsedPlatforms = {
      deepseek: Boolean(saved.platforms?.deepseek),
      ark: Boolean(saved.platforms?.ark),
    };
    collapsedModels = saved.models && typeof saved.models === 'object' ? saved.models : {};
  } catch (error) {
    collapsedPlatforms = { deepseek: false, ark: false };
    collapsedModels = {};
  }
}

function saveCollapsed() {
  try {
    localStorage.setItem(
      'aichat-collapsed-v2',
      JSON.stringify({ platforms: collapsedPlatforms, models: collapsedModels })
    );
  } catch (error) {
    console.warn('折叠状态保存失败', error);
  }
}

function createConversation(platformId, modelId) {
  const meta = MODELS[modelId] || MODELS[platformMeta(platformId).defaultModel];
  const platform = platformMeta(meta.platform);

  const existingEmpty = conversations.find(
    (item) => item.model === meta.id && (!item.messages || item.messages.length === 0)
  );
  if (existingEmpty) {
    activateConversation(existingEmpty.id);
    return existingEmpty;
  }

  const conversation = {
    id: uid(),
    platform: platform.id,
    model: meta.id,
    title: '新对话',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    params: defaultParams(meta),
    messages: [],
  };
  conversations.unshift(conversation);
  persist(conversation);
  activateConversation(conversation.id);
  return conversation;
}

function activateConversation(id) {
  const conversation = conversations.find((item) => item.id === id);
  if (!conversation) return;

  activeId = id;
  attachments = [];
  renderAttachments();

  collapsedPlatforms[conversation.platform] = false;
  collapsedModels[conversation.model] = false;
  saveCollapsed();

  syncComposer();
  renderSidebar();
  renderChat();
  updateHeader();
  updateSendState();
  closeSidebar();
}

function touchConversation(conversation) {
  conversation.updatedAt = Date.now();
  if (!conversation.title || conversation.title === '新对话') {
    const firstUser = conversation.messages.find((message) => message.role === 'user');
    if (firstUser) {
      const text = String(firstUser.text || '').trim();
      if (text) {
        conversation.title = truncate(text, 26);
      } else if (
        (Array.isArray(firstUser.files) && firstUser.files.length) ||
        (Array.isArray(firstUser.images) && firstUser.images.length)
      ) {
        const kind = modelMeta(conversation.model).kind;
        conversation.title = kind === '3d' ? '3D 生成' : kind === 'video' ? '视频生成' : '文件对话';
      }
    }
  }
}

async function deleteConversation(id) {
  const conversation = conversations.find((item) => item.id === id);
  if (!conversation) return;
  if (!window.confirm('删除「' + (conversation.title || '新对话') + '」？此操作不可恢复。')) return;

  conversations = conversations.filter((item) => item.id !== id);
  try {
    await dbDelete(id);
  } catch (error) {
    console.warn('删除本地对话失败', error);
  }

  if (activeId === id) {
    if (conversations.length) {
      const next = conversations
        .slice()
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
      activateConversation(next.id);
    } else {
      createConversation(conversation.platform, conversation.model);
    }
  } else {
    renderSidebar();
  }
  showToast('已删除对话');
}

/* ================= 平台 / 模型切换 ================= */

function handlePlatformChange(platformId) {
  const platform = PLATFORMS[platformId];
  if (!platform) return;
  const conversation = currentConversation();
  if (conversation && conversation.platform === platformId) return;

  const nextMeta = MODELS[platform.defaultModel];

  if (conversation && (!conversation.messages || conversation.messages.length === 0)) {
    conversation.platform = platformId;
    conversation.model = nextMeta.id;
    conversation.params = defaultParams(nextMeta);
    conversation.updatedAt = Date.now();
    attachments = [];
    renderAttachments();
    persist(conversation);
    collapsedPlatforms[platformId] = false;
    collapsedModels[nextMeta.id] = false;
    saveCollapsed();
    syncComposer();
    renderSidebar();
    renderChat();
    updateHeader();
    updateSendState();
    return;
  }

  createConversation(platformId, platform.defaultModel);
}

function handleModelChange(modelId) {
  const meta = MODELS[modelId];
  if (!meta) return;
  const conversation = currentConversation();
  if (conversation && conversation.model === modelId) return;

  if (conversation && (!conversation.messages || conversation.messages.length === 0)) {
    conversation.platform = meta.platform;
    conversation.model = meta.id;
    conversation.params = normalizeParams(meta, conversation.params || {});
    conversation.updatedAt = Date.now();
    attachments = [];
    renderAttachments();
    persist(conversation);
    collapsedPlatforms[meta.platform] = false;
    collapsedModels[meta.id] = false;
    saveCollapsed();
    syncComposer();
    renderSidebar();
    renderChat();
    updateHeader();
    updateSendState();
    return;
  }

  createConversation(meta.platform, meta.id);
}

function syncComposer() {
  const conversation = currentConversation();
  if (!conversation) return;

  const platform = platformMeta(conversation.platform);
  const meta = modelMeta(conversation.model);
  conversation.params = normalizeParams(meta, conversation.params || {});

  document.querySelectorAll('.platform-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.platform === platform.id);
  });

  els.modelSelect.innerHTML = '';
  platform.models.forEach((id) => {
    const model = MODELS[id];
    const option = document.createElement('option');
    option.value = id;
    option.textContent = model.name + ' · ' + kindLabel(model.kind);
    els.modelSelect.appendChild(option);
  });
  els.modelSelect.value = meta.id;

  els.paramFields.innerHTML = '';
  paramDefinitions(meta, conversation.params).forEach((definition) => {
    const label = el('label', 'select-field param-field param-' + definition.key);
    label.appendChild(el('span', null, definition.label));

    const select = document.createElement('select');
    definition.options.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });
    select.value = definition.value;
    select.addEventListener('change', () => {
      const current = currentConversation();
      if (!current) return;
      const currentMeta = modelMeta(current.model);
      current.params[definition.key] =
        definition.key === 'duration' || definition.key === 'maxImages'
          ? Number(select.value)
          : select.value;
      current.params = normalizeParams(currentMeta, current.params);
      current.updatedAt = Date.now();
      persist(current);
      if (definition.key === 'mode' || definition.key === 'version') {
        syncComposer();
      } else {
        updateComposerHint(current, currentMeta);
        updateSendState();
      }
    });
    label.appendChild(select);
    els.paramFields.appendChild(label);
  });

  if (meta.kind === 'image') {
    els.input.disabled = false;
    els.input.placeholder = meta.placeholder;
    els.modelNote.textContent =
      '模型 ID：' +
      (conversation.params.version || meta.modelId) +
      ' · 0/1/多张参考图 = 文生图/图生图/多图融合';

    els.attachBtn.disabled = false;
    els.attachBtn.title = '添加参考图（最多 ' + meta.maxRefs + ' 张）';
    els.attachLabel.textContent = '参考图';
    els.fileInput.accept = '.jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff,.gif,.heic,.heif,image/*';
    els.fileInput.multiple = true;
  } else if (meta.kind === 'video') {
    els.input.disabled = false;
    els.input.placeholder = meta.placeholder;
    els.modelNote.textContent = '模型 ID：' + meta.modelId + ' · 异步视频任务';

    els.attachBtn.disabled = false;
    els.attachBtn.title = '添加首帧图（可选，最多 1 张）';
    els.attachLabel.textContent = '首帧图';
    els.fileInput.accept = '.jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff,.gif,image/*';
    els.fileInput.multiple = false;
  } else if (meta.kind === '3d') {
    els.input.disabled = true;
    els.input.value = '';
    els.input.placeholder = meta.placeholder;
    els.modelNote.textContent = '模型 ID：' + meta.modelId + ' · 图生 3D · 异步任务';

    els.attachBtn.disabled = false;
    els.attachBtn.title = '上传一张参考图（必填）';
    els.attachLabel.textContent = '参考图';
    els.fileInput.accept = '.jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff,.gif,image/*';
    els.fileInput.multiple = false;
  } else if (meta.supportsFiles) {
    els.input.disabled = false;
    els.input.placeholder = meta.placeholder;
    els.modelNote.textContent = '模型 ID：' + meta.modelId;

    els.attachBtn.disabled = false;
    els.attachBtn.title = '上传文件（' + meta.fileFormats + '）';
    els.attachLabel.textContent = '文件';
    els.fileInput.accept = '.jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp';
    els.fileInput.multiple = true;
  } else {
    els.input.disabled = false;
    els.input.placeholder = meta.placeholder;
    els.modelNote.textContent = '模型 ID：' + meta.modelId + ' · 仅文本';

    els.attachBtn.disabled = true;
    els.attachBtn.title = 'DeepSeek V4 Pro 官方不支持图片/文件输入';
    els.attachLabel.textContent = '文件';
    els.fileInput.accept = '';
    els.fileInput.multiple = false;
  }

  updateComposerHint(conversation, meta);
  if (!els.input.disabled) autoGrow();
  updateSendState();
}

function updateComposerHint(conversation, meta) {
  const params = conversation.params;
  if (meta.kind === 'image') {
    const formatLabel = meta.outputFormat ? ' · ' + meta.outputFormat.toUpperCase() : '';
    if (meta.supportsSequential && params.mode === 'group') {
      els.hint.textContent =
        meta.name +
        formatLabel +
        ' · ' +
        params.size +
        ' · 组图（最多 ' +
        params.maxImages +
        ' 张，参考图 + 输出 ≤ 15） · 参考图最多 ' +
        meta.maxRefs +
        ' 张';
    } else {
      els.hint.textContent =
        meta.name +
        formatLabel +
        ' · ' +
        params.size +
        ' · 单图 · 参考图最多 ' +
        meta.maxRefs +
        ' 张';
    }
  } else if (meta.kind === 'video') {
    els.hint.textContent =
      meta.name +
      ' · ' +
      params.resolution +
      ' · ' +
      params.ratio +
      ' · ' +
      params.duration +
      ' 秒 · 首帧图可选 · 异步任务';
  } else if (meta.kind === '3d') {
    const level = meta.subdivisionOptions.find((item) => item.value === params.subdivision);
    els.hint.textContent =
      meta.name +
      ' · ' +
      params.fileFormat.toUpperCase() +
      ' · ' +
      (level ? level.label : params.subdivision) +
      ' · 必须上传 1 张参考图 · 生成可能需要数分钟';
  } else if (meta.supportsFiles) {
    els.hint.textContent =
      meta.name +
      ' · 非思考模式 · 文件格式 ' +
      meta.fileFormats +
      ' · 单文件 ≤ 64 MiB · 最多 6 个';
  } else {
    els.hint.textContent = 'DeepSeek V4 Pro · 非思考模式 · 官方不支持图片/文件输入';
  }
}
function updateHeader() {
  const conversation = currentConversation();
  if (!conversation) return;
  const meta = modelMeta(conversation.model);
  els.convTitle.textContent = conversation.title || '新对话';
  els.modelChip.textContent = meta.name;
  els.modelChip.dataset.platform = conversation.platform;
}

/* ================= 侧栏 ================= */

function renderSidebar() {
  els.platformList.innerHTML = '';

  Object.values(PLATFORMS).forEach((platform) => {
    const platformConversations = conversations.filter((item) => item.platform === platform.id);
    const platformEl = el('section', 'platform-group');
    platformEl.dataset.platform = platform.id;
    if (collapsedPlatforms[platform.id]) platformEl.classList.add('collapsed');

    const head = el('div', 'platform-head');
    const toggle = el('button', 'platform-toggle');
    toggle.type = 'button';
    toggle.dataset.platform = platform.id;
    toggle.innerHTML =
      '<span class="platform-icon">' +
      platform.icon +
      '</span><span class="platform-name">' +
      escapeHtml(platform.name) +
      '</span><span class="group-count">' +
      platformConversations.length +
      '</span><span class="chevron">▾</span>';
    head.appendChild(toggle);

    const body = el('div', 'platform-body');
    platform.models.forEach((modelId) => {
      const meta = MODELS[modelId];
      const items = conversations
        .filter((item) => item.model === modelId)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      const group = el('section', 'conv-group model-group');
      group.dataset.model = modelId;
      if (collapsedModels[modelId]) group.classList.add('collapsed');

      const groupHead = el('div', 'group-head');
      const groupToggle = el('button', 'group-toggle');
      groupToggle.type = 'button';
      groupToggle.dataset.model = modelId;
      groupToggle.title = meta.name;
      groupToggle.innerHTML =
        '<span class="group-name">' +
        escapeHtml(meta.name) +
        '</span><span class="model-kind ' +
        kindClass(meta.kind) +
        '">' +
        kindLabel(meta.kind) +
        '</span><span class="group-count">' +
        items.length +
        '</span><span class="chevron">▾</span>';

      const add = el('button', 'group-add', '＋');
      add.type = 'button';
      add.dataset.platform = platform.id;
      add.dataset.model = modelId;
      add.title = '新建 ' + meta.name + ' 对话';
      groupHead.append(groupToggle, add);

      const list = el('div', 'group-list');
      if (items.length) {
        items.forEach((conversation) => {
          const item = el('div', 'conv-item');
          item.dataset.id = conversation.id;
          if (conversation.id === activeId) item.classList.add('active');
          item.tabIndex = 0;
          item.setAttribute('role', 'button');
          item.title = conversation.title || '新对话';

          const title = el('span', 'conv-title', conversation.title || '新对话');
          const remove = el('button', 'conv-del', '×');
          remove.type = 'button';
          remove.title = '删除对话';
          item.append(title, remove);

          item.addEventListener('click', () => activateConversation(conversation.id));
          item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              activateConversation(conversation.id);
            }
          });
          remove.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteConversation(conversation.id);
          });

          list.appendChild(item);
        });
      }

      group.append(groupHead, list);
      body.appendChild(group);
    });

    platformEl.append(head, body);
    els.platformList.appendChild(platformEl);
  });
}

/* ================= 消息渲染 ================= */

const AVATAR_ICONS = {
  assistant:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3l1.7 4.6 4.6 1.7-4.6 1.7L12 15.6l-1.7-4.6L5.7 9.3l4.6-1.7L12 3z"/>' +
    '<path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>' +
    '</svg>',
  user:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="8" r="3.6"/>' +
    '<path d="M4.5 20.2c.5-3.7 3.6-5.8 7.5-5.8s7 2.1 7.5 5.8"/>' +
    '</svg>',
  error:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3.5l9 16H3l9-16z"/>' +
    '<path d="M12 9v4.5"/>' +
    '<path d="M12 17h.01"/>' +
    '</svg>',
};

function createMsgRow(role) {
  const row = el('div', 'msg ' + role);
  const avatar = el('div', 'avatar avatar-' + role);
  avatar.setAttribute('aria-hidden', 'true');
  avatar.innerHTML = AVATAR_ICONS[role] || AVATAR_ICONS.assistant;
  const body = el('div', 'msg-body');
  row.append(avatar, body);
  return { row, body, avatar };
}

function renderWelcome(modelId) {
  const meta = modelMeta(modelId);
  const wrap = el('div', 'welcome');
  wrap.appendChild(el('div', 'welcome-icon', meta.icon));
  wrap.appendChild(el('h2', null, meta.emptyTitle));
  wrap.appendChild(el('p', 'welcome-desc', meta.emptyDesc));

  if (meta.kind === '3d') {
    wrap.appendChild(
      el(
        'div',
        'welcome-note',
        '请先上传一张参考图，再选择输出格式和面数。支持 JPG / PNG / WebP / BMP / TIFF / GIF；生成为异步任务，通常需要数分钟。'
      )
    );
    els.chat.appendChild(wrap);
    return;
  }

  const suggestions = el('div', 'suggestions');
  meta.suggestions.forEach((text) => {
    const chip = el('button', 'chip', text);
    chip.type = 'button';
    chip.addEventListener('click', () => {
      els.input.value = text;
      autoGrow();
      updateSendState();
      els.input.focus();
    });
    suggestions.appendChild(chip);
  });
  wrap.appendChild(suggestions);
  els.chat.appendChild(wrap);
}

function appendUserAssets(bubble, message) {
  const assets = [];
  if (Array.isArray(message.files)) {
    message.files.forEach((file) => assets.push(file));
  }
  if (Array.isArray(message.images)) {
    message.images.forEach((src, index) => {
      assets.push({ name: '图片 ' + (index + 1), dataUrl: src });
    });
  }
  if (!assets.length) return;

  const grid = el('div', 'file-grid');
  assets.forEach((asset) => {
    const card = el('div', 'file-card');
    if (asset.dataUrl) {
      const image = el('img', 'file-card-img');
      image.src = asset.dataUrl;
      image.alt = asset.name || '文件';
      card.appendChild(image);
    } else {
      card.appendChild(el('div', 'file-card-icon', '📎'));
    }

    const info = el('div', 'file-card-info');
    info.appendChild(el('div', 'file-card-name', asset.name || '文件'));
    const metaParts = [];
    if (asset.size) metaParts.push(formatBytes(asset.size));
    if (asset.fileId) metaParts.push('已上传');
    if (metaParts.length) info.appendChild(el('div', 'file-card-meta', metaParts.join(' · ')));
    card.appendChild(info);
    grid.appendChild(card);
  });
  bubble.appendChild(grid);
}

function renderStoredMessage(conversation, message) {
  if (!message) return;
  const meta = modelMeta(conversation.model);

  if (message.role === 'user') {
    const { row, body } = createMsgRow('user');
    const bubble = el('div', 'bubble');
    if (message.text) bubble.appendChild(el('div', 'msg-text', message.text));
    appendUserAssets(bubble, message);
    body.appendChild(bubble);
    els.chat.appendChild(row);
    return;
  }

  if (message.role === 'assistant' && message.video) {
    const { row, body } = createMsgRow('assistant');
    body.appendChild(el('div', 'msg-meta', meta.name));
    const bubble = el('div', 'bubble bubble-image');

    const video = document.createElement('video');
    video.className = 'gen-video';
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    if (message.video.poster) video.poster = message.video.poster;
    video.src = message.video.url;
    bubble.appendChild(video);

    const actions = el('div', 'img-actions');
    const download = el('a', null, '打开 / 下载视频');
    download.href = message.video.url;
    download.target = '_blank';
    download.rel = 'noopener';
    download.download = 'seedance-' + (message.video.ts || Date.now()) + '.mp4';
    actions.appendChild(download);
    const info = [
      message.video.resolution,
      message.video.ratio,
      message.video.duration ? message.video.duration + ' 秒' : '',
    ]
      .filter(Boolean)
      .join(' · ');
    if (info) actions.appendChild(el('span', 'img-size', info));
    bubble.appendChild(actions);
    bubble.appendChild(el('div', 'media-note', '视频链接 24 小时内有效，请及时下载。'));

    body.appendChild(bubble);
    els.chat.appendChild(row);
    return;
  }

  if (message.role === 'assistant' && message.model3d) {
    const { row, body } = createMsgRow('assistant');
    body.appendChild(el('div', 'msg-meta', meta.name));
    const bubble = el('div', 'bubble bubble-image');
    const card = el('div', 'result-3d');

    if (message.model3d.preview) {
      const preview = el('img', 'result-3d-preview');
      preview.src = message.model3d.preview;
      preview.alt = '3D 参考图';
      card.appendChild(preview);
    } else {
      card.appendChild(el('div', 'result-3d-icon', '⬡'));
    }

    const info = el('div', 'result-3d-info');
    info.appendChild(el('div', 'result-3d-title', '3D 模型已生成'));
    const format = message.model3d.format || 'glb';
    const level = meta.subdivisionOptions?.find(
      (item) => item.value === message.model3d.subdivision
    );
    info.appendChild(
      el(
        'div',
        'result-3d-desc',
        [format.toUpperCase(), level?.label || message.model3d.subdivision]
          .filter(Boolean)
          .join(' · ')
      )
    );

    const actions = el('div', 'result-3d-actions');
    const download = el('a', null, '下载 3D 模型');
    download.href = message.model3d.url;
    download.target = '_blank';
    download.rel = 'noopener';
    download.download = 'seed3d-' + (message.model3d.ts || Date.now()) + '.' + format;
    actions.appendChild(download);

    const open = el('a', null, '在新标签打开');
    open.href = message.model3d.url;
    open.target = '_blank';
    open.rel = 'noopener';
    actions.appendChild(open);
    info.appendChild(actions);
    info.appendChild(
      el('div', 'result-3d-desc', '文件链接 24 小时内有效，下载后可用 3D 软件打开。')
    );

    card.appendChild(info);
    bubble.appendChild(card);
    body.appendChild(bubble);
    els.chat.appendChild(row);
    return;
  }

  if (message.role === 'assistant' && message.images && message.images.length) {
    const { row, body } = createMsgRow('assistant');
    body.appendChild(el('div', 'msg-meta', meta.name));
    const bubble = el('div', 'bubble bubble-image');
    message.images.forEach((image) => {
      const node = el('img', 'gen-image');
      node.src = image.src;
      node.alt = image.alt || '生成的图片';
      bubble.appendChild(node);

      const actions = el('div', 'img-actions');
      const download = el('a', null, '下载图片');
      download.href = image.src;
      download.download =
        'seedream-' + (image.ts || Date.now()) + (image.format === 'jpeg' ? '.jpg' : '.png');
      actions.appendChild(download);
      if (image.size) actions.appendChild(el('span', 'img-size', image.size));
      bubble.appendChild(actions);
    });
    body.appendChild(bubble);
    els.chat.appendChild(row);
    return;
  }

  if (message.role === 'assistant') {
    const { row, body } = createMsgRow('assistant');
    body.appendChild(el('div', 'msg-meta', meta.name));
    const bubble = el('div', 'bubble');
    bubble.innerHTML = renderMarkdown(message.text || '');
    body.appendChild(bubble);
    els.chat.appendChild(row);
    return;
  }

  if (message.role === 'error') {
    const { row, body } = createMsgRow('error');
    body.appendChild(el('div', 'msg-meta', '出错了'));
    const bubble = el('div', 'bubble');
    bubble.textContent = message.text || '未知错误';
    body.appendChild(bubble);
    els.chat.appendChild(row);
  }
}

function renderChat() {
  els.chat.innerHTML = '';
  const conversation = currentConversation();
  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    renderWelcome(conversation ? conversation.model : 'deepseek-flash');
    return;
  }
  conversation.messages.forEach((message) => renderStoredMessage(conversation, message));
  scrollToBottom();
}

function createStreamBubble(conversation) {
  const { row, body } = createMsgRow('assistant');
  body.appendChild(el('div', 'msg-meta', modelMeta(conversation.model).name));
  const bubble = el('div', 'bubble');
  bubble.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  body.appendChild(bubble);
  if (currentConversation() === conversation) els.chat.appendChild(row);

  let latest = '';
  let pending = false;
  let frame = 0;

  function schedule(text) {
    latest = text;
    if (pending) return;
    pending = true;
    frame = requestAnimationFrame(() => {
      pending = false;
      bubble.innerHTML = renderMarkdown(latest);
      if (currentConversation() === conversation) scrollToBottom();
    });
  }

  function finalize() {
    if (frame) cancelAnimationFrame(frame);
    bubble.innerHTML = renderMarkdown(latest);
    if (currentConversation() === conversation) scrollToBottom();
  }

  return {
    row,
    bubble,
    schedule,
    finalize,
    remove: () => row.remove(),
  };
}

function createLoadingBubble(conversation, initialText = '正在生成…') {
  const { row, body } = createMsgRow('assistant');
  body.appendChild(el('div', 'msg-meta', modelMeta(conversation.model).name));
  const bubble = el('div', 'bubble');
  function setStatus(text) {
    bubble.innerHTML =
      '<span class="typing"><span></span><span></span><span></span></span>' +
      '<span class="typing-text">' +
      escapeHtml(text) +
      '</span>';
  }
  setStatus(initialText);
  body.appendChild(bubble);
  if (currentConversation() === conversation) els.chat.appendChild(row);
  return { row, bubble, remove: () => row.remove(), setStatus };
}

/* ================= 附件 ================= */

const DEEPSEEK_FILE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const DEEPSEEK_FILE_EXT = /\.(jpe?g|png|gif|webp)$/i;

function isDeepseekSupportedFile(file) {
  return DEEPSEEK_FILE_MIMES.includes(file.type) || DEEPSEEK_FILE_EXT.test(file.name);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function attachmentStatusText(attachment) {
  if (attachment.status === 'uploading') return '上传中…';
  if (attachment.status === 'error') return attachment.error || '上传失败';
  if (attachment.kind === 'ark-ref') return '参考图' + (attachment.size ? ' · ' + formatBytes(attachment.size) : '');
  if (attachment.kind === 'video-ref') return '首帧图' + (attachment.size ? ' · ' + formatBytes(attachment.size) : '');
  if (attachment.kind === '3d-ref') return '3D 参考图' + (attachment.size ? ' · ' + formatBytes(attachment.size) : '');
  if (attachment.fileId) return '已上传' + (attachment.size ? ' · ' + formatBytes(attachment.size) : '');
  return '待上传';
}

function renderAttachments() {
  els.attachPreview.innerHTML = '';
  attachments.forEach((attachment, index) => {
    const item = el('div', 'preview-item');
    const image = el('img', 'preview-thumb');
    image.src = attachment.dataUrl;
    image.alt = attachment.name || '文件';

    const info = el('div', 'preview-info');
    info.appendChild(el('div', 'preview-name', attachment.name || '文件'));
    const status = el(
      'div',
      'preview-status' + (attachment.status === 'error' ? ' error' : attachment.status === 'uploading' ? ' uploading' : ''),
      attachmentStatusText(attachment)
    );
    info.appendChild(status);

    const remove = el('button', 'remove', '×');
    remove.type = 'button';
    remove.title = '移除';
    remove.addEventListener('click', () => {
      attachments.splice(index, 1);
      renderAttachments();
      updateSendState();
    });

    item.append(image, info, remove);
    els.attachPreview.appendChild(item);
  });
}

async function uploadDeepseekFile(file, attachment) {
  try {
    const form = new FormData();
    form.append('purpose', 'user_data');
    form.append('file', file, file.name);

    const response = await fetch('/api/deepseek/file', {
      method: 'POST',
      headers: { 'X-DeepSeek-Key': getKey('deepseek') },
      body: form,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error?.message || '上传失败（HTTP ' + response.status + '）');
    }
    if (!result.id) throw new Error('文件接口没有返回 file_id');

    attachment.fileId = result.id;
    attachment.status = 'ready';
  } catch (error) {
    attachment.status = 'error';
    attachment.error = error.message || '上传失败';
    showToast('文件上传失败：' + (error.message || '未知错误'));
  }
  renderAttachments();
  updateSendState();
}

async function handleFiles(fileList) {
  const conversation = currentConversation();
  if (!conversation) return;
  const meta = modelMeta(conversation.model);
  const files = Array.from(fileList || []);

  if (meta.kind === 'image' || meta.kind === 'video' || meta.kind === '3d') {
    const label = meta.refLabel || '参考图';
    const remaining = meta.maxRefs - attachments.length;
    if (remaining <= 0) {
      showToast(label + '最多 ' + meta.maxRefs + ' 张');
      return;
    }
    if (files.length > remaining) {
      showToast(label + '最多 ' + meta.maxRefs + ' 张，已保留前 ' + remaining + ' 张');
    }

    for (const file of files.slice(0, remaining)) {
      const isImage =
        file.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|bmp|tiff?|gif|heic|heif)$/i.test(file.name);
      if (!isImage) {
        showToast(label + '需要图片文件');
        continue;
      }
      if (file.size > 30 * 1024 * 1024) {
        showToast('单张参考图不能超过 30 MiB');
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        attachments.push({
          kind:
            meta.kind === 'video' ? 'video-ref' : meta.kind === '3d' ? '3d-ref' : 'ark-ref',
          name: file.name,
          size: file.size,
          dataUrl,
          status: 'ready',
        });
      } catch (error) {
        console.warn('读取参考图失败', error);
      }
    }
    renderAttachments();
    updateSendState();
    return;
  }

  if (!meta.supportsFiles) {
    showToast('DeepSeek V4 Pro 官方不支持图片/文件输入');
    return;
  }

  if (!getKey('deepseek')) {
    openSettings();
    showToast('请先填写 DeepSeek API Key');
    return;
  }

  const remaining = 6 - attachments.length;
  if (remaining <= 0) {
    showToast('单次对话最多添加 6 个文件');
    return;
  }
  if (files.length > remaining) showToast('最多添加 6 个文件，已保留前 ' + remaining + ' 个');

  for (const file of files.slice(0, remaining)) {
    if (!isDeepseekSupportedFile(file)) {
      showToast('DeepSeek 官方目前仅支持 JPEG / PNG / GIF / WebP 文件');
      continue;
    }
    if (file.size > 64 * 1024 * 1024) {
      showToast('单个文件不能超过 64 MiB');
      continue;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const attachment = {
        kind: 'deepseek-file',
        name: file.name,
        size: file.size,
        dataUrl,
        status: 'uploading',
        fileId: null,
      };
      attachments.push(attachment);
      renderAttachments();
      updateSendState();
      uploadDeepseekFile(file, attachment);
    } catch (error) {
      console.warn('读取文件失败', error);
      showToast('读取文件失败');
    }
  }
}

/* ================= 输入与发送状态 ================= */

function updateSendState() {
  const conversation = currentConversation();
  const meta = conversation ? modelMeta(conversation.model) : null;
  const hasText = els.input.value.trim().length > 0;
  let canSend = Boolean(conversation) && !runningConversations.has(conversation.id);

  if (meta && (meta.kind === 'image' || meta.kind === 'video')) {
    canSend = canSend && hasText;
  } else if (meta && meta.kind === '3d') {
    canSend = canSend && attachments.length === 1;
  } else {
    canSend = canSend && (hasText || attachments.length > 0);
  }

  if (attachments.some((item) => item.status === 'uploading')) canSend = false;
  if (attachments.some((item) => item.status === 'error')) canSend = false;

  els.sendBtn.disabled = !canSend;
}

function autoGrow() {
  els.input.style.height = 'auto';
  els.input.style.height = Math.min(els.input.scrollHeight, 180) + 'px';
}

function resetComposer() {
  els.input.value = '';
  attachments = [];
  renderAttachments();
  autoGrow();
  updateSendState();
}

function beginUserTurn(conversation, text, files) {
  const message = {
    role: 'user',
    text,
    files: files.map((item) => ({
      name: item.name,
      size: item.size,
      dataUrl: item.dataUrl,
      fileId: item.fileId || null,
    })),
  };
  conversation.messages.push(message);

  if (currentConversation() === conversation) {
    const welcome = els.chat.querySelector('.welcome');
    if (welcome) welcome.remove();
    renderStoredMessage(conversation, message);
    scrollToBottom();
  }

  touchConversation(conversation);
  persist(conversation);
  renderSidebar();
  updateHeader();
  resetComposer();
}

function addErrorToConversation(conversation, text) {
  const message = { role: 'error', text };
  conversation.messages.push(message);
  touchConversation(conversation);
  persist(conversation);
  renderSidebar();
  updateHeader();

  if (currentConversation() === conversation) {
    const welcome = els.chat.querySelector('.welcome');
    if (welcome) welcome.remove();
    renderStoredMessage(conversation, message);
    scrollToBottom();
  }
}

function buildDeepseekHistory(conversation) {
  const result = [];
  conversation.messages.forEach((message) => {
    if (message.role === 'user') {
      const blocks = [];

      if (Array.isArray(message.files)) {
        message.files.forEach((file) => {
          if (file.fileId) {
            blocks.push({ type: 'file', file_id: file.fileId });
          } else if (file.dataUrl) {
            blocks.push({ type: 'image_url', image_url: { url: file.dataUrl } });
          }
        });
      }

      if (Array.isArray(message.images)) {
        message.images.forEach((url) => {
          blocks.push({ type: 'image_url', image_url: { url } });
        });
      }

      if (blocks.length) {
        result.push({
          role: 'user',
          content: [{ type: 'text', text: message.text || '请分析我上传的文件。' }, ...blocks],
        });
      } else {
        result.push({ role: 'user', content: message.text || '' });
      }
    } else if (message.role === 'assistant' && message.text) {
      result.push({ role: 'assistant', content: message.text });
    }
  });
  return result;
}

async function send() {
  const conversation = currentConversation();
  if (!conversation || runningConversations.has(conversation.id)) return;
  const meta = modelMeta(conversation.model);

  if (attachments.some((item) => item.status === 'uploading')) {
    showToast('文件仍在上传，请稍候');
    return;
  }
  if (attachments.some((item) => item.status === 'error')) {
    showToast('有文件上传失败，请移除后重试');
    return;
  }

  const text = els.input.value.trim();
  const files = attachments.slice();

  if (meta.kind === 'image') {
    if (!text) return;
    await sendSeedream(conversation, text, files);
  } else if (meta.kind === 'video') {
    if (!text) return;
    await sendArkVideo(conversation, text, files);
  } else if (meta.kind === '3d') {
    if (files.length !== 1) {
      showToast('Seed3D 2.0 需要上传 1 张参考图');
      return;
    }
    await sendArk3D(conversation, files);
  } else {
    if (!text && !files.length) return;
    await sendDeepSeek(conversation, text, files);
  }
}

async function sendDeepSeek(conversation, text, files) {
  const key = getKey('deepseek');
  if (!key) {
    openSettings();
    showToast('请先填写 DeepSeek API Key');
    return;
  }
  if (files.some((item) => !item.fileId)) {
    showToast('文件尚未上传完成');
    return;
  }

  beginUserTurn(conversation, text, files);
  runningConversations.add(conversation.id);
  updateSendState();

  const stream = createStreamBubble(conversation);
  let fullText = '';

  try {
    const response = await fetch('/api/deepseek/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: key,
        model: conversation.model,
        messages: buildDeepseekHistory(conversation),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error?.message || '请求失败（HTTP ' + response.status + '）');
    }
    if (!response.body) throw new Error('响应没有可读取的数据流');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let done = false;

    const processLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) return;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') {
        done = true;
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (error) {
        return;
      }
      const delta = parsed.choices?.[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        stream.schedule(fullText);
      }
    };

    while (!done) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        processLine(line);
        if (done) break;
      }
    }
    if (!done && buffer) processLine(buffer);

    stream.finalize();
    conversation.messages.push({ role: 'assistant', text: fullText });
    touchConversation(conversation);
    persist(conversation);
    renderSidebar();
    updateHeader();
  } catch (error) {
    stream.remove();
    addErrorToConversation(conversation, error.message || '请求出错');
  } finally {
    runningConversations.delete(conversation.id);
    updateSendState();
    if (currentConversation() === conversation) els.input.focus();
  }
}

function imageSrcFromItem(item, fallbackFormat = 'png') {
  if (item.b64_json) {
    const value = String(item.b64_json);
    if (value.startsWith('data:')) return value;
    const format = String(item.output_format || fallbackFormat || 'png').toLowerCase();
    const mime = format === 'jpeg' || format === 'jpg' ? 'image/jpeg' : 'image/png';
    return 'data:' + mime + ';base64,' + value;
  }
  return item.url || '';
}

async function sendSeedream(conversation, text, files) {
  const key = getKey('ark');
  if (!key) {
    openSettings();
    showToast('请先填写火山方舟 API Key');
    return;
  }

  beginUserTurn(conversation, text, files);
  runningConversations.add(conversation.id);
  updateSendState();

  const loading = createLoadingBubble(conversation);
  const meta = modelMeta(conversation.model);

  try {
    const body = {
      apiKey: key,
      model: conversation.params.version || conversation.model,
      prompt: text,
      size: conversation.params.size || meta.defaultSize,
    };
    if (meta.supportsSequential) {
      body.mode = conversation.params.mode;
      body.maxImages = conversation.params.maxImages;
    }
    if (files.length) body.image = files.map((item) => item.dataUrl);

    const response = await fetch('/api/ark/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error?.message || '生成失败（HTTP ' + response.status + '）');
    }

    const items = Array.isArray(result.data) ? result.data : [];
    if (!items.length) throw new Error('接口没有返回图片数据');

    const outputFormat = meta.outputFormat || 'png';
    const message = {
      role: 'assistant',
      images: items
        .map((item) => ({
          src: imageSrcFromItem(item, outputFormat),
          size: item.size || '',
          format: String(item.output_format || outputFormat).toLowerCase(),
          alt: text,
          ts: Date.now(),
        }))
        .filter((item) => item.src),
    };
    if (!message.images.length) throw new Error('返回的图片数据为空');

    conversation.messages.push(message);
    loading.remove();

    if (currentConversation() === conversation) {
      renderStoredMessage(conversation, message);
      scrollToBottom();
    }

    touchConversation(conversation);
    persist(conversation);
    renderSidebar();
    updateHeader();
  } catch (error) {
    loading.remove();
    addErrorToConversation(conversation, error.message || '生成出错');
  } finally {
    runningConversations.delete(conversation.id);
    updateSendState();
    if (currentConversation() === conversation) els.input.focus();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function taskStatusText(data) {
  const status = String(data?.status || '').toLowerCase();
  if (status === 'queued') return '排队中…';
  if (status === 'running') return '生成中…';
  if (status === 'succeeded') return '已完成，正在载入…';
  if (status === 'failed') return '任务失败';
  return status ? '任务状态：' + status : '正在处理…';
}

async function pollArkTask(apiKey, taskId, onUpdate, options = {}) {
  const interval = options.interval || 5000;
  const timeout = options.timeout || 15 * 60 * 1000;
  const started = Date.now();
  let first = true;

  while (Date.now() - started < timeout) {
    await sleep(first ? 2000 : interval);
    first = false;

    const response = await fetch('/api/ark/tasks/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, taskId }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message || '任务查询失败（HTTP ' + response.status + '）');
    }
    if (typeof onUpdate === 'function') onUpdate(data);

    const status = String(data.status || '').toLowerCase();
    if (status === 'succeeded' || status === 'success') return data;
    if (status === 'failed' || status === 'error') {
      throw new Error(data.error?.message || data.error?.code || '任务失败');
    }
  }

  throw new Error('任务超时，请稍后到火山方舟控制台查看任务结果');
}

async function sendArkVideo(conversation, text, files) {
  const key = getKey('ark');
  if (!key) {
    openSettings();
    showToast('请先填写火山方舟 API Key');
    return;
  }

  beginUserTurn(conversation, text, files);
  runningConversations.add(conversation.id);
  updateSendState();

  const loading = createLoadingBubble(conversation, '正在创建视频任务…');

  try {
    const params = conversation.params;
    const content = [{ type: 'text', text }];
    if (files.length) {
      content.push({ type: 'image_url', image_url: { url: files[0].dataUrl } });
    }

    const payload = {
      model: conversation.model,
      content,
      resolution: params.resolution,
      ratio: params.ratio,
      duration: Number(params.duration),
      watermark: false,
    };

    const response = await fetch('/api/ark/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: key, payload }),
    });
    const created = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(created.error?.message || '创建视频任务失败（HTTP ' + response.status + '）');
    }
    if (!created.id) throw new Error('任务接口没有返回任务 ID');

    loading.setStatus('视频任务已创建，等待生成…');
    const data = await pollArkTask(
      key,
      created.id,
      (state) => {
        loading.setStatus(
          taskStatusText(state) +
            (state.status === 'running' ? '（视频生成可能需要几分钟）' : '')
        );
      },
      { interval: 5000, timeout: 20 * 60 * 1000 }
    );

    const url = data.content?.video_url || data.content?.url;
    if (!url) throw new Error('任务完成但没有返回视频链接');

    const message = {
      role: 'assistant',
      video: {
        url,
        taskId: created.id,
        resolution: data.resolution || params.resolution,
        ratio: data.ratio || params.ratio,
        duration: data.duration || params.duration,
        poster: files[0]?.dataUrl || '',
        ts: Date.now(),
      },
    };
    conversation.messages.push(message);
    loading.remove();

    if (currentConversation() === conversation) {
      renderStoredMessage(conversation, message);
      scrollToBottom();
    }

    touchConversation(conversation);
    persist(conversation);
    renderSidebar();
    updateHeader();
  } catch (error) {
    loading.remove();
    addErrorToConversation(conversation, error.message || '视频生成失败');
  } finally {
    runningConversations.delete(conversation.id);
    updateSendState();
    if (currentConversation() === conversation) els.input.focus();
  }
}

async function sendArk3D(conversation, files) {
  const key = getKey('ark');
  if (!key) {
    openSettings();
    showToast('请先填写火山方舟 API Key');
    return;
  }
  if (files.length !== 1) {
    showToast('Seed3D 2.0 需要上传 1 张参考图');
    return;
  }

  beginUserTurn(conversation, '', files);
  runningConversations.add(conversation.id);
  updateSendState();

  const loading = createLoadingBubble(conversation, '正在创建 3D 生成任务…');

  try {
    const params = conversation.params;
    const payload = {
      model: conversation.model,
      content: [
        {
          type: 'text',
          text: '--subdivisionlevel ' + params.subdivision + ' --fileformat ' + params.fileFormat,
        },
        { type: 'image_url', image_url: { url: files[0].dataUrl } },
      ],
    };

    const response = await fetch('/api/ark/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: key, payload }),
    });
    const created = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(created.error?.message || '创建 3D 任务失败（HTTP ' + response.status + '）');
    }
    if (!created.id) throw new Error('任务接口没有返回任务 ID');

    loading.setStatus('3D 任务已创建，等待生成…');
    const data = await pollArkTask(
      key,
      created.id,
      (state) => {
        loading.setStatus(
          taskStatusText(state) +
            (state.status === 'running' ? '（3D 生成通常需要数分钟）' : '')
        );
      },
      { interval: 10000, timeout: 30 * 60 * 1000 }
    );

    const url = data.content?.file_url || data.content?.url;
    if (!url) throw new Error('任务完成但没有返回 3D 文件链接');

    const message = {
      role: 'assistant',
      model3d: {
        url,
        taskId: created.id,
        format: params.fileFormat,
        subdivision: params.subdivision,
        preview: files[0].dataUrl,
        ts: Date.now(),
      },
    };
    conversation.messages.push(message);
    loading.remove();

    if (currentConversation() === conversation) {
      renderStoredMessage(conversation, message);
      scrollToBottom();
    }

    touchConversation(conversation);
    persist(conversation);
    renderSidebar();
    updateHeader();
  } catch (error) {
    loading.remove();
    addErrorToConversation(conversation, error.message || '3D 生成失败');
  } finally {
    runningConversations.delete(conversation.id);
    updateSendState();
    if (currentConversation() === conversation) els.input.focus();
  }
}

/* ================= 侧栏移动端 ================= */

function openSidebar() {
  els.sidebar.classList.add('open');
  els.sidebarOverlay.classList.add('show');
}

function closeSidebar() {
  els.sidebar.classList.remove('open');
  els.sidebarOverlay.classList.remove('show');
}

/* ================= 事件绑定 ================= */

function bindEvents() {
  els.input.addEventListener('input', () => {
    autoGrow();
    updateSendState();
  });

  els.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!els.sendBtn.disabled) send();
    }
  });

  els.sendBtn.addEventListener('click', send);
  els.attachBtn.addEventListener('click', () => {
    if (!els.attachBtn.disabled) els.fileInput.click();
  });

  els.fileInput.addEventListener('change', async () => {
    await handleFiles(els.fileInput.files);
    els.fileInput.value = '';
  });

  els.platformSwitch.addEventListener('click', (event) => {
    const button = event.target.closest('.platform-btn');
    if (button) handlePlatformChange(button.dataset.platform);
  });

  els.modelSelect.addEventListener('change', () => {
    handleModelChange(els.modelSelect.value);
  });

  els.newChatBtn.addEventListener('click', () => {
    const conversation = currentConversation();
    if (!conversation) {
      createConversation('deepseek', 'deepseek-flash');
    } else {
      createConversation(conversation.platform, conversation.model);
    }
  });

  els.themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  els.settingsBtn.addEventListener('click', openSettings);
  els.closeSettingsBtn.addEventListener('click', closeSettings);
  els.settingsModal.addEventListener('click', (event) => {
    if (event.target === els.settingsModal) closeSettings();
  });

  document.querySelectorAll('.eye-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  els.menuBtn.addEventListener('click', openSidebar);
  els.sidebarOverlay.addEventListener('click', closeSidebar);

  els.platformList.addEventListener('click', (event) => {
    const platformToggle = event.target.closest('.platform-toggle');
    if (platformToggle) {
      const platformId = platformToggle.closest('.platform-group').dataset.platform;
      collapsedPlatforms[platformId] = !collapsedPlatforms[platformId];
      saveCollapsed();
      renderSidebar();
      return;
    }

    const modelToggle = event.target.closest('.model-toggle, .group-toggle');
    if (modelToggle) {
      const modelId = modelToggle.closest('.model-group').dataset.model;
      collapsedModels[modelId] = !collapsedModels[modelId];
      saveCollapsed();
      renderSidebar();
      return;
    }

    const addButton = event.target.closest('.group-add');
    if (addButton) {
      createConversation(addButton.dataset.platform, addButton.dataset.model);
      closeSidebar();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!els.settingsModal.hidden) {
      closeSettings();
    } else {
      closeSidebar();
    }
  });
}

/* ================= 初始化 ================= */

async function init() {
  initTheme();
  loadKeys();
  loadCollapsed();
  bindEvents();

  try {
    const stored = await dbGetAll();
    conversations = stored.map(normalizeConversation);
  } catch (error) {
    console.warn('读取本地对话失败', error);
    conversations = [];
  }

  conversations.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  if (conversations.length) {
    activateConversation(conversations[0].id);
  } else {
    createConversation('deepseek', 'deepseek-flash');
  }

  updateSendState();
}

init();
