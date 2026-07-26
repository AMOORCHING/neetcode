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


def find_violators(requests: list[tuple[int, str]], limit: int, window: int) -> list[str]:
    user_requests = defaultdict(deque)
    violators = []
    already_added = set()

    for timestamp, user_id in requests:
        timestamps = user_requests[user_id]
        earliest_allowed = timestamp - window + 1

        while timestamps and timestamps[0] < earliest_allowed:
            timestamps.popleft()

        timestamps.append(timestamp)

        if len(timestamps) > limit and user_id not in already_added:
            violators.append(user_id)
            already_added.add(user_id)

    return violators