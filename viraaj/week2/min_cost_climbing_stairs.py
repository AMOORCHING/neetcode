class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
    # need to calculate the min cost at the specific stair
    # taking top down approach here, need to circle back to bottom up
        memo = [-1] * len(cost)

        def dfs(i)  :
            if i >= len(cost):
                return 0
            elif memo[i] != -1:
                return memo[i]
            else:
                memo[i] = cost[i] + min(dfs(i + 1), dfs(i + 2))
            return memo[i]

        return min(dfs(0), dfs(1)) 
