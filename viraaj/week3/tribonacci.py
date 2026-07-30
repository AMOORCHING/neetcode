class Solution:
    def tribonacci(self, n: int) -> int:
        array = [0, 1, 1]
        if n == 0:
            return 0
        if n == 1 or n == 2:
            return 1
        for i in range(2, n):
            temp = sum(array)
            array[0] = array[1]
            array[1] = array[2]
            array[2] = temp
            

        # 5
        # 0, 1, 1, 2, 4, 7
        # 0, 1, 2, 3, 4, 5
        
        return array[2]
            