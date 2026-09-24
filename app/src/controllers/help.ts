export default function showHelp(){
    console.log(`Usage: dutoaocs <command> [arguments]

Commands:
  init
    Initialise a new dutoaocs project in the current directory.

  add-llm
    Show the steps for safely adding an LLM API key to the project.

  add-llm --verify
    Verify the LLM API key setup and mark it as linked in the project.

  add-doc-file <doc-path>
    Add an existing documentation file to the project.

  rem-doc-file <doc-path>
    Remove a documentation file from the project configuration.

  clear-docs
    Remove documentation files from the configuration when they no longer exist.

  list-docs
    List all documentation files in the project.

  add-context <doc-path> <context-path>
    Add a context file to an existing documentation file.

  rem-context <doc-path> <context-path>
    Remove a context file from an existing documentation file.

  clear-context
    Remove context files from the configuration when they no longer exist.

  list-context [doc-path]
    List context files for one documentation file, or all context files when no
    documentation path is provided.

  update-doc <doc-path>
    Update one documentation file using its allowed context.

  update-all
    Update all documentation files using their allowed context.

  --help
    Show this help message.`)
}
