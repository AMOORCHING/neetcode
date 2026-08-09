class Solution:
    def isMajorityElement(self, nums: List[int], target: int) -> bool:
        frequency = 0

        for n in nums:
            if n == target:
                frequency += 1
        
        if frequency > len(nums) / 2:
            return True

        return False