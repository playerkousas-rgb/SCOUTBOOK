/**
 * PWA 註冊與自動更新。
 *
 * 更新流程（用戶把 APP 加到主畫面之後，全程不需要刪除重裝）：
 *   1. 背景每 30 分鐘、以及每次由背景切回前景（visibilitychange）都主動 reg.update()；
 *   2. 偵測到新版 SW 安裝完成（waiting）即派發 UPDATE_EVENT，畫面彈出「有新版本」提示；
 *   3. 用戶一按即 postMessage({ type: 'SKIP_WAITING' })；
 *   4. controllerchange 時自動 location.reload()，載入的已是新版本。
 */
export const UPDATE_EVENT = 'scoutbook:update';

const UPDATE_INTERVAL_MS = 30 * 60 * 1000;

let refreshing = false;
let checkTimer = null;

export function registerPwa() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  // 開發模式下 SW 會蓋住 HMR；需要實測更新流程時可加 ?sw=1
  const forced = new URLSearchParams(window.location.search).get('sw') === '1';
  if (!import.meta.env.PROD && !forced) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  const announce = () => window.dispatchEvent(new CustomEvent(UPDATE_EVENT));

  const watch = (reg) => {
    if (reg.waiting && navigator.serviceWorker.controller) announce();
    reg.addEventListener('updatefound', () => {
      const installing = reg.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        // 已有 controller 才代表是「更新」；首次安裝不應彈提示
        if (installing.state === 'installed' && navigator.serviceWorker.controller) announce();
      });
    });

    const check = () => {
      if (document.visibilityState !== 'visible') return;
      reg.update().catch(() => {});
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });
    window.addEventListener('focus', check);
    window.addEventListener('online', check);
    if (checkTimer) clearInterval(checkTimer);
    checkTimer = setInterval(check, UPDATE_INTERVAL_MS);
    // 開機後主動查一次，避免長期只靠 HTTP cache 判斷「沒有更新」
    check();
  };

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' });
      watch(reg);
    } catch {
      /* 不支援 SW 的來源或私密視窗：核心功能照常運作，只是沒有離線快取 */
    }
  });
}

export async function applyPwaUpdate() {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      // 保險：若 controllerchange 遲遲未到（例如 waiting 已被其他分頁接管），最多 3 秒後自行重載
      setTimeout(() => {
        if (!refreshing) window.location.reload();
      }, 3000);
      return;
    }
  } catch {
    /* ignore */
  }
  window.location.reload();
}
