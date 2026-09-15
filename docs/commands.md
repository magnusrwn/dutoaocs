# Command-line interface

The executable entry point is [`app/bin.ts`](app/bin.ts). It loads environment variables from `.env`, uses the current working directory as the project location, and dispatches the first command-line argument to the corresponding controller.

Run commands from the project directory:

```bash
npx tsx app/bin.ts <command> [options]
```

## Available commands

- `--help` — Displays command help.
- `init` — Initializes documentation configuration for the current project.
- `add-llm` — Adds an LLM link to the project. Include `--verify` to run the LLM verification step first.
- `add-doc-file` — Adds a documentation file to the configured project documentation set.
- `rem-doc-file` — Removes a documentation file from the configured documentation set.
- `clear-docs` — Removes stale or no-longer-valid documentation-file entries.
- `add-context` — Adds an allowed context entry for documentation processing.
- `rem-context` — Removes an allowed context entry.
- `clear-context` — Removes stale or no-longer-valid context entries.
- `update-doc` — Updates a selected documentation file using the configured context and LLM settings.
- `update-all` — Updates all configured documentation files.

Unknown commands print an error message and do not run an operation.

## Runtime behavior

- The working directory (`process.cwd()`) determines which project is initialized or updated.
- Environment variables are loaded automatically through `dotenv/config` before command handling begins.
- Command implementations are provided by the controllers imported in [`app/bin.ts`](app/bin.ts).
- Commands that perform asynchronous work, including initialization, LLM setup, and documentation updates, are awaited by the CLI entry point.
