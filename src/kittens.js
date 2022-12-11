import './kittens.css';
import kittens from './kittens.json';

const flickrBlockedIds = new Set([
  '48944060348', // https://www.flickr.com/photos/75885098@N05/48944060348
  '49186129532', // https://www.flickr.com/photos/14056438@N08/49186129532
  '52463011905', // https://www.flickr.com/photos/72616463@N00/52463011905
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

  let flickrPhotos = await fetchFlickrPhotos();

  if (flickrPhotos.length > 0) {
    let attempts = 0;
    let photo;

    // Some Flickr photos don't have a `url_l` size available, and some Flickr
    // photos should never be displayed. Try up to 25 times to find a photo
    // that'll work before giving up.
    do {
      attempts += 1;
      photo = flickrPhotos[Math.floor(Math.random() * flickrPhotos.length)];
    } while (!photo.url_l && !flickrBlockedIds.has(photo.id) && attempts < 25)

    if (photo.url_l) {
      return {
        imageAlt: photo.title,
        imageUrl: photo.url_l,
        url: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`,
      };
    }
  }

  return randomKitten;
}

/**
 * Fetches a set of kitten photos from Flickr.
 *
 * If the Flickr API call fails for any reason, an empty array will be returned.
 */
async function fetchFlickrPhotos() {
  let url = new URL('https://www.flickr.com/services/rest');

  // See https://www.flickr.com/services/api/flickr.photos.search.html
  url.search = new URLSearchParams({
    method: 'flickr.photos.search',
    api_key: 'c1e552ce2698888886d28bd83d717d4c',
    content_type: '1', // photos only
    content_types: '0', // non-virtual photos
    extras: 'url_l',
    format: 'json',
    license: '1,2,3,4,5,6,7,8,9,10', // CC licensed or public domain
    media: 'photos',
    nojsoncallback: '1',
    per_page: '50',
    sort: 'interestingness-desc', // tends to produce good photos, and each search seems to return a different set
    tags: 'kitten,kittens'
  }).toString();

  let response;

  try {
    response = await fetch(url);
  } catch (err) {
    console.error('Flickr API request failed', err);
    return [];
  }

  if (!response.ok) {
    console.error('Flickr API request failed', response.status, response.statusText);
    return [];
  }

  try {
    let { photos } = await response.json();
    return photos.photo ?? [];
  } catch (err) {
    console.error(err);
  }

  return [];
}
