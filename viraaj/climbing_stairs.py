class Solution:
    def climbStairs(self, n: int) -> int:
        # n = 1, x = 1
        # n = 2, x = 2
        # n = 3, x = 3
        # n = 4, x = 5
        # n = 5, x = 
        if n < 3:
            return n
        dp = [1, 2]
        for i in range(1, n - 2):
            temp = dp[1]
            dp[1] = temp + dp[0]
            dp[0] = temp
        return dp[0] + dp[1]
