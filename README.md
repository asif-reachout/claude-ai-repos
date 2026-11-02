# GitHub Repos for Claude & AI

A curated, filterable list of open-source GitHub repos for Claude, AI agents, free ChatGPT / Grok / ElevenLabs / Higgsfield alternatives, trading bots and thesis research tools.

**Live page:** https://asif-reachout.github.io/claude-ai-repos/

## What's on the page

- **Repos** with logos, star counts, categories and a cost label:
  - **Free**: nothing to pay for the tool itself
  - **Free · pay for AI**: the tool is free, but it uses an AI service you pay for (or free models)
  - **Free + paid plan**: open source, and the makers also sell a paid version
- **Free Claude Code**: OpenRouter, AgentRouter, Free LLM API and Ollama, with setup steps
- **Shortcuts & prompts**: Claude Code commands, ready-made prompts and 99 prompt codes

## Star counts update themselves

`.github/workflows/update-stars.yml` runs every day at 07:30 Malaysia time. It runs `scripts/update-stars.mjs`, which asks the GitHub API for each repo's stars and commits the new numbers. No AI is involved, so it costs nothing. You can also run it by hand from the **Actions** tab → **Update star counts** → **Run workflow**.

## Add a repo

Open `index.html`, find `const repos = [` and copy one block below the line `// Add new repos below this line 👇`:

```js
{ name: "New Repo", url: "https://github.com/owner/repo",
  description: "What it does, in one or two sentences.",
  category: "Claude Skills & Tools", tag: "1k stars" },
```

- A new `category` name creates a new filter automatically.
- The logo comes from the owner's GitHub picture.
- For cost, add `cost: "keys"` or `cost: "paid", costNote: "Pro $10/mo"`. Leave it out for free tools.
- The star count is corrected by the daily update.
