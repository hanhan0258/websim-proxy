// api/proxy.js

export default async function handler(req, res) {
  // 只允许post请求
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // 读取body
  const body = req.body;

  try {
    const fetchResponse = await fetch('https://api.websim.com/api/v1/inference/run_chat_completion', {
      method: 'POST',
      headers: {
        ...req.headers,
        host: 'api.websim.com', // 覆盖 Host
      },
      body: JSON.stringify(body),
    });

    const data = await fetchResponse.text(); // 或者 .json()
    res.status(fetchResponse.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
