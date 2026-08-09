class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        heap = []
        heapq.heapify(heap)
        heapMax = []
        heapq.heapify(heapMax)

        for i in range(len(profits)):
            if capital[i] <= w:
                heapq.heappush(heapMax, [-profits[i], i])
            else:
                heapq.heappush(heap, [capital[i], profits[i]])

        
        for i in range(k):
            while heap and heap[0][0] <= w:
                capitals, profit = heapq.heappop(heap)
                heapq.heappush(heapMax, [-profit, len(heap)])
            
            if heapMax:
                neg, idx = heapq.heappop(heapMax)
                w += -neg
        
        return w
            

        



