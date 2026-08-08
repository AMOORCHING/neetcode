class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        output = 0
        visited = deepcopy(grid)

        for r in range(len(grid)):
            for c in range(len(grid[0])):
                visited[r][c] = 0
        
        def dfs(r, c):
            if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]):
                return 0
            if visited[r][c] == 1 or grid[r][c] == 0:
                return 0
            
            visited[r][c] = 1
            return 1 + dfs(r + 1, c) + dfs(r - 1, c)  + dfs(r, c + 1) + dfs(r, c - 1)

        
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                output = max(dfs(r, c), output)
        
        return output
