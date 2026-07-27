from collections import defaultdict, deque


# Problem:
# You are given API request logs in chronological order.
# Each request is represented as (timestamp, user_id).
#
# A user violates the rate limit if they make more than `limit`
# requests during any rolling `window`-second period.
#
# Write a function that returns every user who violated the limit,
# without duplicates, in the order they first violated it.
#
# A request at time t belongs to the interval:
# [t - window + 1, t]
#
# Example:
# requests = [
#     (1, "alice"),
#     (10, "bob"),
#     (20, "alice"),
#     (30, "alice"),
#     (40, "bob"),
#     (50, "alice"),
#     (70, "bob"),
# ]
#
# limit = 3
# window = 60
#
# Output:
# ["alice"]
#
# Aim for O(n) time.

from collections import deque


def rate_limiter(window: int, limit: int, requests):
    users = {}
    result = []

    for timestamp, user_id in requests:
        if user_id not in users:
            users[user_id] = {
                "timestamps": deque(),
                "violated": False
            }

        user_data = users[user_id]
        queue = user_data["timestamps"]

        start_of_window = timestamp - window + 1

        while queue and queue[0] < start_of_window:
            queue.popleft()

        queue.append(timestamp)

        if len(queue) > limit and not user_data["violated"]:
            result.append(user_id)
            user_data["violated"] = True

    return result
