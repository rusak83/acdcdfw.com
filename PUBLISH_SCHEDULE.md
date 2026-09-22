# Publish schedule — coil-cleaning-guide

The pillar and four product pages are live. The remaining ten are built and deployed but
carry `<meta name="robots" content="noindex">` and are **not** in `sitemap.xml`.

To publish a page: remove the `noindex` meta, add its URL to `sitemap.xml`
(`changefreq monthly`, `priority 0.7`), commit, push, resubmit the sitemap in Search Console.

## Live (2026-09-22)

| Page | URL |
|---|---|
| Pillar | `/coil-cleaning-guide/` |
| Blackhawk | `/coil-cleaning-guide/blackhawk/` |
| Evap Fresh No Rinse | `/coil-cleaning-guide/evap-fresh-no-rinse/` |
| Nu-Brite | `/coil-cleaning-guide/nu-brite/` |
| Tri-Pow'r HD | `/coil-cleaning-guide/tri-powr-hd/` |

## Queued — 2 per week

| Week of | Page | URL |
|---|---|---|
| 2026-09-29 | CalClean | `/coil-cleaning-guide/calclean/` |
| 2026-09-29 | Cal-Brite Plus | `/coil-cleaning-guide/cal-brite-plus/` |
| 2026-10-06 | Special HD CalClean | `/coil-cleaning-guide/special-hd-calclean/` |
| 2026-10-06 | Foam-Brite | `/coil-cleaning-guide/foam-brite/` |
| 2026-10-13 | Alka-Brite Plus | `/coil-cleaning-guide/alka-brite-plus/` |
| 2026-10-13 | TriClean 2X | `/coil-cleaning-guide/triclean-2x/` |
| 2026-10-20 | Evap Pow'r-C | `/coil-cleaning-guide/evap-powr-c/` |
| 2026-10-20 | Evap Green | `/coil-cleaning-guide/evap-green/` |
| 2026-10-27 | Cal Green | `/coil-cleaning-guide/cal-green/` |
| 2026-10-27 | Nu-Solve NR | `/coil-cleaning-guide/nu-solve-nr/` |

Order is by how often the product comes up on our own jobs: the kitchen and
condenser workhorses first, the specialist and green-line products last.

## Open items

- Every page carries one `<!-- TODO: photo from ACDC_Care_Photos -->`. Real coil photos exist in
  `ACDC_Care_Photos_local/08_Другое_бренды/` (`refrigeration_coil_dirty_before_*`,
  `merchandiser_coil_before_*`, `merchandiser_coil_cleaning_rag_*`) — they were not inserted
  because this task scoped images out.
