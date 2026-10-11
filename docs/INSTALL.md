# Install Public Kit

Download [SKILL.md](https://raw.githubusercontent.com/klmnki/public-kit/main/SKILL.md) and save it in a folder named `public-kit`. Keep the filename uppercase. The file includes instructions, 18 institutional source guides, example requests and the licence; it needs no companion files.

| Client | In one project | For your projects on this machine |
| --- | --- | --- |
| Codex | `.agents/skills/public-kit/SKILL.md` | `~/.agents/skills/public-kit/SKILL.md` |
| Claude Code | `.claude/skills/public-kit/SKILL.md` | `~/.claude/skills/public-kit/SKILL.md` |

The `~` location is your user home. Use a project path to keep the skill with that project's files. Start a new session if the client has not discovered the added skill.

Invoke `$public-kit` in Codex or `/public-kit` in Claude Code, then ask:

> Compare population in Moldova, Georgia and Serbia from 2020 to 2024. Show the figures, calculate the change and include the source notes.

Continue with another country, a shorter period or a different output. The assistant should preserve the context and retrieve new data as needed.

## Tools and access

Your session needs an allowed way to fetch URLs or execute HTTP requests. Public Kit provides instructions; your client supplies the model, tools and network permissions. Without retrieval tools or network access, the assistant can prepare a query but cannot verify a live answer.

The included API and public-download routes are free within provider limits. NASA FIRMS needs a free MAP_KEY; Copernicus needs a free account, token and acceptance of the selected dataset's terms. Configure those credentials through your approved local secret storage. Most examples require no account. Your existing AI service's usage limits still apply.

These installation paths cover Codex and Claude Code. A local personal folder does not install the skill in Claude Cowork or a cloud account. Those surfaces use their own account-level skill settings.

Official references: [Agent Skills format](https://agentskills.io/specification), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude Code skills](https://code.claude.com/docs/en/skills).