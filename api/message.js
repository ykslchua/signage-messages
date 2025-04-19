export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, timestamp } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const jsonContent = {
    message,
    timestamp
  };

  const content = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

  const repoOwner = 'ykslchua';
  const repoName = 'signage-messages';
  const filePath = 'object.json'; // File path in the repo
  const branch = 'main'; // or 'master', whichever your default branch is
  const token = process.env.GITHUB_TOKEN;

  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  try {
    // Check if file already exists to get its SHA
    const checkRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const checkData = await checkRes.json();
    const sha = checkData.sha;

    // Upload (create or update) the file
    const uploadRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Update object.json at ${timestamp}`,
        content,
        branch,
        sha
      })
    });

    const result = await uploadRes.json();

    if (uploadRes.ok) {
      return res.status(200).json({ status: 'success', url: result.content.html_url });
    } else {
      return res.status(500).json({ error: result.message || 'GitHub upload failed' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error', details: err.message });
  }
}
