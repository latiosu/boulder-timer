# MyApp Project

Boulder Timer is a static client-side web application built with Svelte and SvelteKit.
The core functionality lives in the `src/` folder, and static assets live in (`static/`).

## Build & Commands

- Check formatting and lint everything: `bun run lint`
- Fix formatting: `bun run format`
- Start development server: `bun run dev`
- Build for production: `bun run build`
- Preview production build: `bun run preview`

### Development Environment

- Frontend dev server: http://localhost:5173

## Code Style

- TypeScript: Strict mode
- Tabs for indentation (2 spaces for YAML/JSON/MD)
- Single quotes, semicolons, no trailing commas
- Use JSDoc docstrings for documenting TypeScript definitions, not `//` comments
- 100 character line limit
- Imports: Use consistent-type-imports
- Use descriptive variable/function names
- In CamelCase names, use "URL" (not "Url"), "API" (not "Api"), "ID" (not "Id")
- Use TypeScript interfaces for public APIs
- NEVER use `@ts-expect-error` or `@ts-ignore` to suppress type errors

## Architecture

- Frontend: Svelte with TypeScript
- Styling: Tailwind CSS
- Build tool: Vite
- Package manager: bun

## Security

- Use appropriate data types that limit exposure of sensitive information
- Never commit secrets or API keys to repository
- Use environment variables for sensitive data
- Validate all user inputs on both client and server
- Use HTTPS in production
- Regular dependency updates
- Follow principle of least privilege

## Git Workflow

- Fix linting errors with `bun run lint`
- Run `bun run build` to verify typecheck passes
- NEVER use `git push --force` on the main branch
- Use `git push --force-with-lease` for feature branches if needed
- Always verify current branch before force operations

## Configuration

When adding new configuration options, update all relevant places:

1. Documentation in README.md

All configuration keys use consistent naming and MUST be documented.
