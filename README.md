# tetoMIDI web

Static page plus one serverless function (`api/gist.js`) that creates the gist.

## Deploy to Vercel
1. Push this folder to GitHub, then import the repo into Vercel (or run `vercel --prod`).
2. In Project > Settings > Environment Variables, add:
   - `GITHUB_TOKEN` = a GitHub token with gist scope (a fine-grained token limited to gists is recommended).
3. Redeploy so the variable takes effect.

The token is only read on the server. The browser never receives it.
