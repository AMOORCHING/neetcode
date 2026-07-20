class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        counter = 0
        
        for row in range(len(grid)):
            for col in range(len(grid[0])):
                if grid[row][col] == "1":
                    self.helper(grid, row, col)
                    counter += 1

        return counter

    def helper(self, grid, row, col):
        if (
            row < 0
            or row >= len(grid)
            or col < 0
            or col >= len(grid[0])
            or grid[row][col] == "0"
        ):
            return

        grid[row][col] = "0"
        self.helper(grid, row + 1, col)
        self.helper(grid, row - 1, col)
        self.helper(grid, row, col + 1)
        self.helper(grid, row, col - 1)
        
        