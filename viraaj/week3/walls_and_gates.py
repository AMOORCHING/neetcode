class Solution:
    def islandsAndTreasure(self, grid: List[List[int]]) -> None:
        queue = []
        visited = set()
        
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if grid[r][c] == 0:
                    queue.append([r, c])
                    visited.add((r, c))
        
        distance = 0
        while queue:
            for _ in range(len(queue)):
                temp = queue.pop(0)
                r = temp[0]
                c = temp[1]
                grid[r][c] = distance
                if r + 1 < len(grid) and grid[r + 1][c] == 2147483647 and (r + 1, c) not in visited:
                    queue.append([r + 1, c])
                    visited.add((r + 1, c))
                if r - 1 >= 0 and grid[r - 1][c] == 2147483647 and (r - 1, c) not in visited:
                    queue.append([r - 1, c])
                    visited.add((r - 1, c))
                if c + 1 < len(grid[0]) and grid[r][c + 1] == 2147483647 and (r, c + 1) not in visited:
                    queue.append([r, c + 1])
                    visited.add((r, c + 1))
                if c - 1 >= 0 and grid[r][c - 1] == 2147483647 and (r, c - 1) not in visited:
                    queue.append([r, c - 1])
                    visited.add((r, c - 1))
            
            distance += 1
        
        


        


