// Vercel serverless function: creates a gist from the script.
// Requires the GITHUB_TOKEN environment variable set in Vercel (Project > Settings > Environment Variables).
// The token is only used on the server and is never sent to the browser.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({ error: "server is missing GITHUB_TOKEN" });
    return;
  }

  const content = req.body && req.body.content;
  if (typeof content !== "string" || !content.trim()) {
    res.status(400).json({ error: "missing script content" });
    return;
  }
  if (content.length > 2000000) {
    res.status(413).json({ error: "script is too large" });
    return;
  }

  try {
    const r = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "tetomidi-web"
      },
      body: JSON.stringify({
        description: "tetoMIDI custom song",
        public: false,
        files: { "custom_song.lua": { content } }
      })
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(502).json({ error: "GitHub returned " + r.status + " (check that the token has gist scope)" });
      return;
    }
    res.status(200).json({
      html_url: data.html_url,
      raw_url: data.files["custom_song.lua"].raw_url
    });
  } catch (err) {
    res.status(500).json({ error: "could not reach GitHub" });
  }
};
