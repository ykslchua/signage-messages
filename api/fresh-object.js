export default async function handler(req, res) {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/ykslchua/signage-messages/main/object.json?cache=${Date.now()}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch object.json' });
  }
}
