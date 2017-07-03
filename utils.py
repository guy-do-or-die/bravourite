import settings
import random

from functools import lru_cache
from requests import get

VK_LIMIT = 100
ARIST_INDEX = 4


def extract_set_info(snippet):
    title = snippet['title']
    artist, *ctx = title.split(' Boiler Room ')
    thumb = snippet['thumbnails']['medium']['url']
    location = ' '.join((ctx or [''])[0].split()[:-2]).replace('x ', '') or ''
    artist = artist.split(': ')[-1:][0].replace(' x', '').rstrip(' – ')
    description = snippet['description']
    tags = snippet.get('tags')
    return locals()


@lru_cache(maxsize=100)
def search_request(artist):
    resp = get(settings.SEARCH_URL, params=dict(
        key=settings.YOUTUBE_KEY, channelId=settings.CHANNEL,
        part='id', type='video', maxResults=2, videoDuration='long',
        q=artist)).json().get('items', [])

    while resp:
        id = (resp.pop().get('id') or {}).get('videoId')
        video = videos_request(id)

        if (video.get('artist') == artist and
            id not in settings.SETS):
            return id


@lru_cache(maxsize=100)
def videos_request(id):
    resp = get(settings.INFO_URL, params=dict(
        part='snippet',
        id=id, key=settings.YOUTUBE_KEY
    ))

    json = resp.json()
    item = (json['items'] or [None])[0]

    if item:
        snippet = item['snippet']
        return extract_set_info(snippet)

    return {}


@lru_cache(maxsize=10)
def vk_request(offset=0, limit=VK_LIMIT):
    return get(settings.VK_URL, params=dict(
        method='by_owner', owner_id=settings.VK_ID,
        key=settings.VK_KEY, offset=offset, count=limit))


def consume_youtube(id):
    return videos_request(id)


def consume_vk():
    count = vk_request().json().get('totalCount')
    artists = set([])
    chunks = []

    def consumer():
        while True:
            try:
                chunks_count = count // VK_LIMIT + 1
                chunks = random.sample(range(chunks_count), chunks_count)
                artists.clear()

                while chunks:
                    offset = chunks.pop() * VK_LIMIT
                    limit = min(count - offset, VK_LIMIT)

                    chunk = vk_request(offset, limit).json().get('list')

                    for i in random.sample(range(VK_LIMIT), VK_LIMIT):
                        artist = chunk[i][ARIST_INDEX]

                        if artist not in artists:
                            resp = search_request(artist)
                            artists.add(artist)

                            if resp:
                                yield resp
            except:
                pass

    return consumer()
