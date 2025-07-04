export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 兼容 Vercel 的 req.body 可能为 undefined，需要读取原始流
  let body = '';
  try {
    if (req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    } else {
      // 某些部署环境下 req.body 不可直接获取，可根据需要扩展输入流解析
      body = '';
    }
  } catch (e) { body = ''; }

  // WebSim API
  const API_URL = 'https://api.websim.com/api/v1/inference/run_chat_completion';

  try {
    const apiRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        // 如果 Websim 需要 API-KEY, 在这里加上
        // 'Authorization': `Bearer ${process.env.WEBSIM_API_KEY}`,
        // 你可根据实际需要转发Headers
      },
      body
    });
    // websim的返回有可能是json，前端大多希望原样返回
    const contentType = apiRes.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await apiRes.text()
      : await apiRes.text();

    res.status(apiRes.status).send(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
