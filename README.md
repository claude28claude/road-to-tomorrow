# Road to Tomorrow

A fan-made tracker of every DC movie and show worth watching before **Man of Tomorrow**
(in theaters July 9, 2027).

No build step and no dependencies — the page is a single HTML file, with an icon set,
a web manifest, and a small service worker alongside it so browsers can install it as
an app.

## Installing it

Open [the live site](https://claude28claude.github.io/road-to-tomorrow/) and choose
**Install** — the icon in Chrome's address bar on desktop, or "Add to Home screen" on a
phone. It then launches from your home screen or app list like any other app, with its
own icon and no browser chrome around it.

Once installed it works without a connection. The page is cached on first visit, and each
poster is kept after you have seen it once.

## What it does

- **Counts down** to Man of Tomorrow's premiere, live to the second.
- **Shows the poster** for every title, so the list is scannable at a glance.
- **Lists 37 titles in watch order**, grouped into six parts: the Christopher Reeve era,
  the Burton/Schumacher Batman films, Nolan's Dark Knight trilogy, the DCEU, the
  Elseworlds one-offs, and James Gunn's new DCU.
- **Marks what actually matters.** Each entry is tagged CORE (required homework),
  LEGACY (history, not homework), or OPTIONAL, so you can take the short road or the long one.
- **Warns you at stop points** — places where watching in the obvious order spoils something.
- **Tracks your progress.** Tap any title to check it off. Progress is saved in your own
  browser and never leaves your device, so the link is safe to share.

## Running it locally

Open `index.html` directly and the tracker works. To exercise the installable-app side
you need it served over HTTP rather than opened as a file, because browsers only run
service workers on a real origin:

```
npx http-server . -p 8124 -c-1
```

## The icon

`icons/` holds the app icons: a road running toward a sunrise, in the site's navy, blue
and gold. Alongside the ordinary square icons there are `icon-maskable-*.png`, which keep
the artwork inside a padded safe area so Android's circular mask doesn't clip it.

## Notes

Not affiliated with DC Studios or Warner Bros. Rotten Tomatoes scores are approximate
snapshots taken when the page was written, and runtimes for unreleased titles are estimates.

Poster art is loaded from Wikimedia — the same images shown on each title's Wikipedia
page — and is used here only to identify each film. Copyright in the posters remains with
their owners. Nothing is copied into this repository.
