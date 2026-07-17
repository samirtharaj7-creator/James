# James Commentary deployment

The production site is configured for:

`https://james.mybibleexplorer.com`

The Next.js application uses a static export. A push to `main` runs the full
content validation, TypeScript, lint, and production build checks; uploads the
`out/` directory; and deploys it through GitHub Pages.

## One-time GitHub setup

1. Create the repository at `https://github.com/samirtharaj7-creator/James`
   and push this project to its `main` branch.
2. Open **Settings → Pages** in the repository and select **GitHub Actions** as
   the publishing source.
3. In the Pages custom-domain field, enter
   `james.mybibleexplorer.com`.
4. At the DNS provider for `mybibleexplorer.com`, add this record:

   | Type | Host | Target |
   | --- | --- | --- |
   | CNAME | `james` | `samirtharaj7-creator.github.io` |

5. After GitHub provisions the certificate, enable **Enforce HTTPS**.

Verifying `mybibleexplorer.com` in the GitHub account settings is also
recommended to protect its Pages subdomains from takeover.

## Local production check

```bash
npm ci
npm run deploy:check
```

The preflight command validates the commentary, checks TypeScript and lint,
builds the static export, and verifies the deployable files. The generated
`out/` directory must contain `index.html`, `404.html`, `.nojekyll`, `CNAME`,
the background and articles pages, all five chapter pages under `out/james/`,
and the local production images.

The Articles page is intentionally published with an empty state. The article
data shape and detail-page presentation remain in place, ready to be connected
when the first future article is added to `lib/articles.ts`.

No deployment secret is required. The workflow sets the public production URL,
includes the hidden `.nojekyll` file in the Pages artifact, and refuses to
deploy if a required page or asset is missing.
