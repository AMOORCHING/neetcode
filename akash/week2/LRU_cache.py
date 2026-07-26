
from collections import OrderedDict


class LRUCache:

    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.cap = capacity

        

    def get(self, key: int) -> int:
        if self.cache.get(key):
            self.cache.move_to_end(key)
            return self.cache.get(key)
        return -1
        

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value
        self.cache.move_to_end(key)
        if(len(self.cache) > self.cap):
            self.cache.popitem(last=False)
        
