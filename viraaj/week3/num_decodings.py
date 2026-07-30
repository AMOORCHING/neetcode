class Solution:
    def numDecodings(self, s: str) -> int:
        # look into numbers of either one or two digits
        # conditions for termination
        # if the number is > 25 or it has a leading 0
        # if it reaches the last character of the string, return 1
        memo = {}
        def dfs(i):
            if i >= len(s):
                return 1
            if i in memo:
                return memo[i]
            ways = 0
            if int(s[i]) != 0:
                ways += dfs(i + 1)
            if i + 1 < len(s) and s[i] != '0' and int(s[i] + s[i + 1]) <= 26:
                ways += dfs(i + 2)
            memo[i] = ways
            return memo[i]
        return dfs(0)