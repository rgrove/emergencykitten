import './kittens.css';
import kittenData from './kittens.json';
import { flickrSearch, getKittenDataFromFlickrSearchResult } from './lib/flickr';

const { kittens } = kittenData;

const flickrBlockedIds = new Set([
  '32885627128', // https://www.flickr.com/photos/153584064@N07/32885627128
  '48944060348', // https://www.flickr.com/photos/75885098@N05/48944060348
  '49186129532', // https://www.flickr.com/photos/14056438@N08/49186129532
  '52462827519', // https://www.flickr.com/photos/72616463@N00/52462827519
  '52463011905', // https://www.flickr.com/photos/72616463@N00/52463011905
]);

const flickrBlockedOwners = new Set([
  '14056438@N08', // mistagged photos
  '72616463@N00', // gory photos
]);

/**
 * Returns data for a random kitten photo.
 *
 * There's a random chance this will be either a curated photo or a random
 * Flickr photo.
 *
 * Flickr photos are a little risky since we can't guarantee they're actually
 * photos of kittens (or that they're even good photos), but including them in
 * the mix ensures an endless supply of kittens.
 */
export async function getRandomKitten() {
  let randomKitten = kittens[Math.floor(Math.random() * kittens.length)];

  if (Math.random() < 0.5) {
    return randomKitten;
  }

  let flickrPhotos = await flickrSearch();

  if (flickrPhotos.length === 0) {
    return randomKitten;
  }

  let photo;
  let retries = 0;

  // Some Flickr photos don't have a `url_l` size available, and some Flickr
  // photos should never be displayed. Try up to 25 times to find a photo
  // that'll work before giving up.
  do {
    photo = flickrPhotos[Math.floor(Math.random() * flickrPhotos.length)];

    if (!photo.url_l || flickrBlockedIds.has(photo.id) || flickrBlockedOwners.has(photo.owner)) {
      photo = null;
    }
  } while (!photo && (retries += 1) < 25)

  if (photo?.url_l) {
    randomKitten = getKittenDataFromFlickrSearchResult(photo);
    console.debug(randomKitten);
  }

  return randomKitten;
}
