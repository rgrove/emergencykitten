const flickrApiKey = 'c1e552ce2698888886d28bd83d717d4c';
const flickrApiUrl = 'https://www.flickr.com/services/rest';

const flickrLicenses = new Map([
  ['1', {
    name: 'CC BY-NC-SA 2.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/2.0/',
  }],
  ['2', {
    name: 'CC BY-NC 2.0',
    url: 'https://creativecommons.org/licenses/by-nc/2.0/',
  }],
  ['3', {
    name: 'CC BY-NC-ND 2.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/',
  }],
  ['4', {
    name: 'CC BY 2.0',
    url: 'https://creativecommons.org/licenses/by/2.0/',
  }],
  ['5', {
    name: 'CC BY-SA 2.0',
    url: 'https://creativecommons.org/licenses/by-sa/2.0/',
  }],
  ['6', {
    name: 'CC BY-ND 2.0',
    url: 'https://creativecommons.org/licenses/by-nd/2.0/',
  }],
  ['7', {
    name: 'No known copyright restrictions',
    url: 'https://www.flickr.com/commons/usage/'
  }],
  ['8', {
    name: 'US Government Work',
    url: 'https://www.usa.gov/government-works',
  }],
  ['9', {
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  }],
  ['10', {
    name: 'Public Domain Mark 1.0',
    url: 'https://creativecommons.org/publicdomain/mark/1.0/',
  }],
]);

/**
 * Performs a Flickr search for kitten photos and returns an array of results.
 *
 * If the Flickr API call fails for any reason, an empty array will be returned.
 *
 * @param {Record<string, string>} [params]
 *   Additional query parameters to pass to the Flickr API.
 *
 * @see https://www.flickr.com/services/api/flickr.photos.search.html
 */
export async function flickrSearch(params) {
  let url = new URL(flickrApiUrl);

  url.search = new URLSearchParams({
    method: 'flickr.photos.search',
    api_key: flickrApiKey,
    content_type: '1', // photos only
    content_types: '0', // non-virtual photos
    extras: 'license,owner_name,url_l',
    format: 'json',
    license: Array.from(flickrLicenses.keys()).join(','),
    media: 'photos',
    nojsoncallback: '1',
    per_page: '50',
    sort: 'interestingness-desc', // tends to produce good photos, and each search seems to return a different set
    tags: 'kitten,kittens',
    ...params
  }).toString();

  let [ , data ] = await fetchJson(url);
  return data?.photos?.photo ?? [];
}

/**
 * Returns a kitten data object based on the given Flickr search result.
 *
 * @param {Record<string, unknown>} searchResult
 */
export function getKittenDataFromFlickrSearchResult(searchResult) {
  return {
    author: {
      name: searchResult.ownername,
      url: `https://www.flickr.com/photos/${searchResult.owner}`,
    },
    license: flickrLicenses.get(searchResult.license),
    image: {
      alt: searchResult.title,
      url: searchResult.url_l,
    },
    title: searchResult.title,
    url: `https://www.flickr.com/photos/${searchResult.owner}/${searchResult.id}`,
  };
}

/**
 * Returns a kitten data object based on the given Flickr `photos.getInfo`
 * result.
 *
 * @param {Record<string, unknown>} photo
 */
export function getKittenDataFromFlickrPhotoInfo(photo) {
  return {
    author: {
      name: photo.owner.username,
      url: `https://www.flickr.com/photos/${photo.owner.nsid}`,
    },
    license: flickrLicenses.get(photo.license),
    image: {
      alt: photo.title._content,
      url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
    },
    title: photo.title._content,
    url: `https://www.flickr.com/photos/${photo.owner.nsid}/${photo.id}`,
  };
}

// -- Private Functions --------------------------------------------------------
async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error('Fetch failed', error);
    return [ error ];
  }

  if (!response.ok) {
    console.warn('HTTP error', response.status, response.statusText);
    return [];
  }

  let data;

  try {
    data = await response.json();
  } catch (error) {
    console.error(error);
    return [ error ];
  }

  return [ null, data ];
}

// You found a secret easter egg! This is used to manually fetch Flickr photo
// data to make updates to the curated kitten data easier. Someday I'll write a
// script to make this easier.
globalThis.kittenFromFlickrUrl = async (flickrUrl) => {
  let photoId = new URL(flickrUrl)
    .pathname
    .split('/')[3];

  let url = new URL(flickrApiUrl);

  // See https://www.flickr.com/services/api/flickr.photos.getInfo.html
  url.search = new URLSearchParams({
    method: 'flickr.photos.getInfo',
    api_key: flickrApiKey,
    format: 'json',
    nojsoncallback: '1',
    photo_id: photoId,
  }).toString();

  let [ , data ] = await fetchJson(url);

  if (data?.photo) {
    return getKittenDataFromFlickrPhotoInfo(data.photo);
  }
}
