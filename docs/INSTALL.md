# Install Public Kit

The deliverable is one file: [SKILL.md](../SKILL.md). It includes the workflow, 27 source guides, templates, worked example, attribution and licence. No scripts or adjacent files are required to use the skill.

Save the file in a folder named `public-kit`. Keep the filename uppercase `SKILL.md`, as required by the portable skill format.

| Client | Project installation | Personal installation |
| --- | --- | --- |
| Codex | `.agents/skills/public-kit/SKILL.md` | `~/.agents/skills/public-kit/SKILL.md` |
| Claude Code | `.claude/skills/public-kit/SKILL.md` | `~/.claude/skills/public-kit/SKILL.md` |

The `~` location is your user home. Use a project folder if you want the skill to travel with that project. Start a new session if your client does not discover newly added skills immediately. Invoke `$public-kit` in Codex or `/public-kit` in Claude Code, or ask a question that matches its description.

Example: “Use public-kit to compare these service options. Show the evidence, the assumptions and what could change the recommendation.”

Review the file before installing. The skill uses the model and tools available in your session; it does not add connectors, grant data access or install a model. Live requests may require provider accounts and can incur charges. A skill is guidance to the agent, not a guarantee of analytical correctness.

The paths above describe Codex and Claude Code. Other Claude surfaces have their own skill upload and account requirements; a local project folder does not automatically install a skill in a cloud account.

Format and installation references: [Agent Skills specification](https://agentskills.io/specification), [Codex skills](https://developers.openai.com/codex/skills), [Claude Code skills](https://code.claude.com/docs/en/skills).
