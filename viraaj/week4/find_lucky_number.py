class Solution:
    def findLucky(self, arr: List[int]) -> int:
        maps = {}
        for i in arr:
            if i not in maps:
                maps[i] = 0
            maps[i]+=1
        largest = -1
        for key in maps:
            if maps[key] == key:
                largest = max(largest, key)
        return largest