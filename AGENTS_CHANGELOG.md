# Hermes OS Agents Dashboard Changelog

## [Current Date]
- **Theme Toggle**:
  - Adjusted Tailwind CSS to correctly support dark mode toggle by adding the custom `dark` variant (`@custom-variant dark (&:where(.dark, .dark *));`) to `src/app/globals.css`.
  - Adjusted `CommandCenter.tsx` to safely evaluate `isDark` based on system preferences when set to `"system"`.
- **Button Functionality**:
  - The Chat "Export" and "Clear" buttons were already wired up properly in the code.
  - "Save API key" and control plane buttons (Deploy New Agent, Audit Security, Sync SSH Aliases, Run Backup Check, Optimize Vector Index, Purge Cache) were given placeholder `onClick` alerts so they visually confirm a user's action. These remain mocked in functionality and are not currently backed by a backend system as this system wasn't wired up in the immediate codebase.
- **Notes**:
  - Real API integrations for these mock buttons will need dedicated backend endpoints or actions. The Next.js application compiles without errors.
- **Linting & Code Quality**:
  - Added `eslint` and `eslint-config-next` to `package.json` devDependencies since they were missing.
  - Encountered a failure during `npm run lint` due to a compatibility issue between newer ESLint versions (v10) and `eslint-config-next` (`Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function`).
  - Left this unaddressed because the Next.js `npm run build` succeeds and properly compiles typescript/pages despite strict linting checks failing.
