class Solution:
    def addBinary(self, a: str, b: str) -> str:
        decimal = int(a, 2) + int(b, 2)
        binary = bin(decimal)[2:]

        return binary