AVINASH PAWAR PORTFOLIO — DEVELOPER HANDOVER
Snapshot date: 1 October 2026 — updated handover v2, including mobile menu

START HERE
1. Extract this ZIP into its own folder.
2. Read DEVELOPER_HANDOVER.txt.
3. Open a terminal in the extracted folder and run:
   python -m http.server 4173 --bind 127.0.0.1 --directory website
   On Windows, use py instead of python if appropriate.
4. Visit http://127.0.0.1:4173/ in your browser.
   Alternatively use any static development server with website as its root.

No npm installation, bundler, framework, database, or build step is required.
Do not rely on opening index.html with a file:// URL; use an HTTP server.

CONTENTS
website/                     Complete editable site and all 151 current files
DEVELOPER_HANDOVER.txt        Implementation, layout, interaction and deployment guide
CHAT_CONTEXT.txt             Detailed conversation handoff for another account
PAGE_CONTENT.txt             Text extracted from the page, including responsive variants
ASSET_MANIFEST.json           File sizes and SHA-256 hashes for every website file
VALIDATION_REPORT.json        Integrity and local-reference verification results
references/                  Available user-supplied design screenshots
REFERENCE_INDEX.txt          Exact reference filenames and availability
hosting/hosting.example.json Account-independent static hosting example

The ZIP is the single developer handover file. The separate chat context TXT is
also included inside it, so a developer or a new assistant can work from this ZIP.
This is the actual HTML/CSS/JavaScript site, not screenshots flattened into a page.
Some supplied visual compositions are intentionally SVG assets; the Tools network
uses separate editable nodes and connector paths for future animation.
