# Command-line interface

The executable entry point is [`app/bin.ts`](app/bin.ts). It loads environment variables from `.env`, uses the current working directory as the project location, and dispatches the first command-line argument to the corresponding controller.

Run commands from the project directory:

```bash
npx tsx app/bin.ts <command> [arguments]
```

## Available commands

- `--help` — Displays command help.
- `init` — Initializes documentation configuration for the current project.
- `add-llm` — Adds an LLM link to the project. Include `--verify` anywhere in the arguments to run LLM verification before adding the link.
- `add-doc-file [arguments]` — Adds a documentation file to the configured documentation set. Additional arguments are passed to the controller.
- `rem-doc-file [arguments]` — Removes a documentation file from the configured documentation set. Additional arguments are passed to the controller.
- `clear-docs` — Removes stale or no-longer-valid documentation-file entries.
- `list-docs` — Lists configured documentation files.
- `add-context [arguments]` — Adds an allowed context entry for documentation processing. Additional arguments are passed to the controller.
- `rem-context [arguments]` — Removes an allowed context entry. Additional arguments are passed to the controller.
- `clear-context` — Removes stale or no-longer-valid context entries.
- `list-context [filter]` — Lists configured context entries, optionally using the second command-line argument as a filter or selector.
- `update-doc [arguments]` — Updates a selected documentation file using the configured context and LLM settings. Additional arguments are passed to the controller.
- `update-all` — Updates all configured documentation files.

Unknown commands print `unknown command "<command>"` and do not run an operation. If no command is supplied, the message contains an empty command name.

## Runtime behavior

- The working directory (`process.cwd()`) determines which project is initialized or updated.
- Environment variables are loaded automatically through `dotenv/config` before command handling begins.
- Command implementations are provided by the controllers imported in [`app/bin.ts`](app/bin.ts).
- Initialization, LLM operations, and documentation updates are awaited by the CLI entry point.
- The CLI passes the complete argument list to file, context, and document-update controllers; command-specific positional arguments and options are defined by those controllers.
