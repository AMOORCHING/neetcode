"""
PROBLEM: Log Analyzer

You're given a list of server log entries (as strings). Each line has this format:

    "2026-07-14 09:15:32 | user_id=42 | endpoint=/api/orders | status=200 | latency_ms=120"

Write a function `analyze_logs(logs: list[str]) -> dict` that processes these
entries and returns a summary dictionary with:

    1. total_requests
         - total number of log entries.

    2. requests_per_endpoint
         - dict mapping each endpoint to how many times it was hit.

    3. error_rate_per_endpoint
         - dict mapping each endpoint to its error rate (status >= 400),
           rounded to 2 decimals.

    4. avg_latency_per_endpoint
         - dict mapping each endpoint to average latency in ms,
           rounded to 2 decimals.

    5. top_user
         - the user_id (as an int) with the most requests. Assume no ties.

Example input:

    logs = [
        "2026-07-14 09:15:32 | user_id=42 | endpoint=/api/orders | status=200 | latency_ms=120",
        "2026-07-14 09:15:35 | user_id=17 | endpoint=/api/orders | status=500 | latency_ms=340",
        "2026-07-14 09:15:40 | user_id=42 | endpoint=/api/users | status=200 | latency_ms=80",
    ]

Constraints / notes:
    - Assume the log format is always well-formed (no need to handle malformed lines).
    - Latency and status should be parsed as integers.
    - Aim for clean, readable code -- this is as much about structure as correctness.

What this tests: string parsing, dictionary aggregation, single-pass vs.
multi-pass thinking, and handling edge cases like empty input.
"""


def analyze_logs(logs: list[str]) -> dict:
    total_requests = len(logs)
    
    # key: endpoint, value: # of requests, # of errors, total latency
    log_dict = {}
    
    # key: user_id, value: # of requests
    
    user_dict = {}
    
    for log in logs:
        temp = log.split(" | ")
        endpoint = temp[2].split("=", 1)[1]
        user = temp[1].split("=", 1)[1]
        
        if endpoint in log_dict:
            log_dict[endpoint][0] += 1
        else:
            log_dict[endpoint] = [1, 0, 0]
        if int(temp[3]) >= 400:
            log_dict[endpoint][1] += 1
        log_dict[endpoint][2] += int(temp[4])
        
        if user in user_dict:
            user_dict[user] += 1
        else:
            user_dict[user] = 1
            
    requests_per_endpoint = {}
    error_rate_per_endpoint = {}
    avg_latency_per_endpoint = {}
    
    for endpoint, (count, errors, total_latency) in log_dict.items():
        requests_per_endpoint[endpoint] = count
        error_rate_per_endpoint[endpoint] = round(errors / count, 2)
        avg_latency_per_endpoint[endpoint] = round(total_latency / count, 2)
        
    """
    didn't really know how to return
    return {
        "total_requests": total_requests,
        "requests_per_endpoint": requests_per_endpoint,
        "error_rate_per_endpoint": error_rate_per_endpoint,
        "avg_latency_per_endpoint": avg_latency_per_endpoint,
        "top_user": top_user,
    }   
    
    """