# Emergency Kitten!

[Emergency Kitten](https://www.emergencykitten.com) shows you a random kitten on every pageview. Because sometimes you just need a kitten.

## Kitten Sources

Kittens can come from two places:

1.   A small set of curated kittens that are hard-coded in `src/kittens.json`.

2.   A [Flickr](https://www.flickr.com/) search for interesting CC-licensed or public domain photos tagged with `kitten` or `kittens`.

Exactly which place a kitten comes from on any given pageview is completely random. If the Flickr API call fails for any reason, a kitten from the curated set will be used instead.

From time to time you may see a photo that doesn't contain a kitten. This just means someone mistagged it on Flickr. Sorry about that.

## Development

To run Emergency Kittens locally, you'll need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io).

After cloning this repo, use pnpm to install dependencies:

```bash
pnpm install
```

To start a development server, run:

```bash
pnpm start
```

This will start a dev server at <http://127.0.0.1:8000> (or the next available port). Open that URL in your browser. You can now edit the files under `public/` and `src/` and your changes will be built automatically when you reload the page.

## Contributing

The best way to contribute is to upload pictures of kittens to Flickr! At this time, we don't need any more curated kittens. If you spot a bug or a broken kitten, please [file an issue](https://github.com/rgrove/emergencykitten/issues).

We're not looking for new features or new data sources at this time.
