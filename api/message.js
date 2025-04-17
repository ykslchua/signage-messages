
export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received:', req.body);
    return res.status(200).json({ status: 'Message received' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
