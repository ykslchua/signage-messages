let latestMessage = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(buffers).toString());

      console.log('Received:', body);
      latestMessage = body;

      return res.status(200).json({ status: 'Message received' });
    } catch (error) {
      console.error('Error parsing body:', error);
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  if (req.method === 'GET') {
    if (!latestMessage) {
      return res.status(404).json({ error: 'No message found' });
    }
    return res.status(200).json(latestMessage);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
