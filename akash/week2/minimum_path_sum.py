import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int: 

        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if (j > 0 and i > 0):
                    grid[i][j] += min(grid[i][j - 1], grid[i - 1][j])
                    continue

                if(j != 0):
                    grid[i][j] += grid[i][j - 1]
                if(i != 0):
                    grid[i][j] += grid[i - 1][j]



        return grid[len(grid) - 1][len(grid[0]) - 1]

                
                

