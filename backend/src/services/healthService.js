export async function checkUrlHealth(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url.originalUrl, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    const status = response.status >= 200 && response.status < 400 ? 'healthy' : response.status < 500 ? 'warning' : 'down';
    return { status, httpStatus: response.status, checkedAt: new Date(), message: response.statusText || status };
  } catch (error) {
    return { status: 'down', checkedAt: new Date(), message: error.message };
  } finally {
    clearTimeout(timeout);
  }
}
