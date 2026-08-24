// Purpose: tiny shared formatters (numbers/time) · Phase 5

/** Join a root-absolute path with Vite's base URL so links and assets survive
 *  subpath hosting (e.g. GitHub Pages `/<repo>/`). BASE_URL always ends with "/".
 *  Locally resolves to the same path; under Pages it gains the repo prefix. */
export function withBase(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
