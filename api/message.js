export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Good
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, timestamp } = req.body;
  const jsonContent = {
    message,
    timestamp
  };

  const fileContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // add this in your Vercel environment
  const REPO_OWNER = 'ykslchua';
  const REPO_NAME = 'signage-messages';
  const FILE_PATH = 'object.json'; // can be a folder path too
  const BRANCH = 'main';

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  try {
    // Get the SHA of the existing file if it exists
    const existing = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    let sha;
    if (existing.status === 200) {
      const existingData = await existing.json();
      sha = existingData.sha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: 'Update billboard message',
        content: fileContent,
        sha: sha, // include only if updating
        branch: BRANCH
      })
    });

    const data = await response.json();
    return res.status(200).json({ status: 'Saved to GitHub', url: data.content.html_url });
  } catch (err) {
    console.error('GitHub API error:', err);
    return res.status(500).json({ error: 'Failed to write to GitHub' });
  }
}
