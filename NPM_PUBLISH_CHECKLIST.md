# npm publish checklist

Audit date: 24 September 2026

Current verdict: **not ready to publish yet**. The package is close, but the build and packed CLI need fixing first.

## Must do before publishing

- [ ] Add `typescript` to `devDependencies` and refresh `package-lock.json`. The `build` script calls `tsc`, but a clean install does not currently provide it.
- [ ] Make publishing build from a clean output directory (for example, a `clean` script plus `prepack: "npm run clean && npm run build"`). `app/dist` contains stale and duplicate output, including `app/dist/app/src/**` and files that no longer exist in source.
- [ ] Rebuild and smoke-test the actual packaged executable. The current `app/dist/bin.js --help` output is older than `app/src/controllers/help.ts`, proving that the shipped CLI is stale.
- [ ] Fix `.gitignore` verification in `verifyGitignore.ts`. It concatenates `currentpath + ".gitignore"`; because the CLI passes a path without a trailing slash, it looks beside the project directory instead of inside it. Use `path.join(currentpath, ".gitignore")` and add a regression test.
- [ ] Restrict the published files with a `files` allowlist in `package.json` (preferably `app/dist`, `README.md`, `LICENSE`, and optionally `.env.example`). The current dry run packs 102 files, including TypeScript source, tests, `tsconfig.json`, `dutoaocs.config.json`, and stale build artifacts.
- [ ] Add a real `LICENSE` file or change the `license` field. `package.json` declares MIT, but no license file exists.
- [ ] Rewrite the README for npm users: add prerequisites, installation (`npm install -g dutoaocs` / `npx dutoaocs`), quick start, command usage, OpenAI API-key setup, configuration format, data/privacy and API-cost notes, and fix the malformed documentation link.
- [ ] Declare the supported Node.js version with `engines.node`. The installed `openai@7.5.0` requires Node `>=22.0.0`, so the package should state and test that requirement.
- [ ] Replace the live OpenAI call in `verifyOpenAiApi.test.ts` with a mocked client. The current test requires a real secret, spends API quota, and can fail because of network/service state. Also make the dotenv test set and restore its own test environment variable.
- [ ] Run a clean-install release check: `npm ci`, `npm run build`, `npm test`, `npm pack --dry-run`, install the generated tarball in a temporary project, and exercise at least `dutoaocs --help`, `init`, and `add-llm --verify`.

## Recommended release polish

- [ ] Add `package.json` scripts for `typecheck`, `clean`, `prepack`, and a packaged-CLI smoke test; run them in CI on the minimum supported Node version.
- [ ] Set meaningful non-zero exit codes for unknown commands and failed operations so shell scripts and CI can detect failures.
- [ ] Decide whether `1.0.0` accurately signals production stability. The CLI help still labels `update-all` as work in progress; consider starting at `0.1.0` if the interface is not stable.
- [ ] Add useful npm `keywords`, and consider `publishConfig: { "access": "public" }` to make public-package intent explicit.
- [ ] Check that the npm account owns or can publish the intended package immediately before release. `npm view dutoaocs` returned `E404` during this audit, so the unscoped name appears unused, but registry availability is not reserved until publication.
- [ ] Review command/help wording and typos before release, and keep README command documentation synchronized with `--help`.
- [ ] Consider pinning the OpenAI model through configuration instead of hard-coding model names in two locations, so model availability can be changed without a CLI release.
- [ ] Add a changelog/release notes and tag the release after the final package smoke test.

## Checks that already pass

- [x] Package name, version, repository, homepage, bugs URL, author, license field, and CLI `bin` mapping are present.
- [x] The compiled entry point has a Node shebang and npm packs it as executable.
- [x] The test suite passes: 34/34 tests on 24 September 2026.
- [x] `npm audit --omit=dev` reports 0 known production dependency vulnerabilities.
- [x] `.env` is ignored and is not included in the package dry run; `.env.example` contains no key.
- [x] The repository remote matches the URLs declared in `package.json`.

## Final publish sequence

- [ ] Sign in with the intended npm account and enable the account's required 2FA/publishing authentication.
- [ ] Confirm the final version with `npm version` (or update it through the normal release workflow).
- [ ] Run the clean-install and tarball smoke tests above one last time.
- [ ] Inspect `npm pack --dry-run` and confirm that it contains only intentional release files.
- [ ] Publish with `npm publish --access public`, then install from npm in a fresh temporary project and run `dutoaocs --help`.
