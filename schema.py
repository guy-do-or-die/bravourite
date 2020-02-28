import settings
import random

from promise import promisify
from promise.dataloader import DataLoader

from graphene import Schema, ObjectType, String, List, Int, Argument

from utils import consume_youtube, consume_vk


FIELDS = ('id', 'title', 'artist', 'thumb', 'location', 'tags')


def make_method(field):
    method = lambda self, *args: self.resolve().get(field)
    method.__name__ = field
    return method


class Set(ObjectType):
    def resolve(self):
        return consume_youtube(self.id)

    locals().update({f: String() for f in FIELDS})
    locals().update({'resolve_%s' % f: make_method(f)
                     for f in FIELDS if f != 'id'})


class SetLoader(DataLoader):
    @promisify
    def batch_load_fn(self, ids):
        return [Set(id) for id in ids]


class Sets(ObjectType):
    sets = List(lambda: Set,
                place=Argument(String, default_value='first'),
                limit=Argument(Int, default_value=1))

    def resolve_sets(self, _, place=0, limit=5):

        data = dict(
            first=lambda: [settings.THE_FIRST],
            second=lambda: random.sample(settings.SETS, limit),
            third=lambda: [next(my_audios)]
        ).get(place, lambda: [])()

        return set_loader.load_many(data)


set_loader = SetLoader()
schema = Schema(query=Sets, types=[Set])

my_audios = consume_vk()
