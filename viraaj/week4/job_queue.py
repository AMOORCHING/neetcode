"""
PROBLEM: Job Queue with Retries

You're building a simple in-process job queue for a background worker
system. Jobs can fail, and failed jobs should be retried up to a max
number of attempts before being marked permanently failed.

Each job is represented as a dict:

    {"job_id": "job1", "payload": "send_email", "priority": 2}

Higher `priority` values should run first. Jobs with equal priority should
run in the order they were added (FIFO within the same priority level).

Implement a class `JobQueue` with the following interface:

    class JobQueue:
        def __init__(self, max_retries: int):
            ...

        def add_job(self, job_id: str, payload, priority: int = 0) -> None:
            # Add a new job to the queue.
            ...

        def get_next_job(self):
            # Return the highest-priority job (dict with job_id, payload,
            # priority, attempts) WITHOUT removing it from tracking -- it's
            # now "in progress". Return None if queue is empty.
            ...

        def mark_failed(self, job_id: str) -> None:
            # Mark the current job's attempt as failed. If attempts remain
            # (< max_retries), re-add it to the queue at the SAME priority.
            # If attempts are exhausted, move it to permanently_failed.
            ...

        def mark_success(self, job_id: str) -> None:
            # Remove the job from tracking entirely -- it's done.
            ...

        def permanently_failed_jobs(self) -> list[str]:
            # Return job_ids that exhausted their retries, in the order
            # they were permanently failed.
            ...

Example:

    q = JobQueue(max_retries=2)
    q.add_job("j1", "task_a", priority=1)
    q.add_job("j2", "task_b", priority=5)
    q.add_job("j3", "task_c", priority=1)

    job = q.get_next_job()       # j2 (highest priority)
    q.mark_success("j2")

    job = q.get_next_job()       # j1 (added before j3, same priority)
    q.mark_failed("j1")          # attempt 1 failed, retry remains -> re-queued

    job = q.get_next_job()       # j3 (j1 went to back of its priority tier)
    q.mark_success("j3")

    job = q.get_next_job()       # j1 again
    q.mark_failed("j1")          # attempt 2 failed, retry remains -> re-queued
    job = q.get_next_job()       # j1
    q.mark_failed("j1")          # attempt 3 failed, max_retries=2 exhausted -> permanently failed

    q.permanently_failed_jobs()  # ["j1"]

Constraints / notes:
    - "attempts" should count failed attempts, not successful ones.
    - Assume job_ids are unique.
    - Think carefully about what state you need to track between
      get_next_job() and mark_failed()/mark_success() -- a job is
      "in progress" between those calls.

What this tests: designing a small stateful system (not just a pure
function), managing object lifecycle across multiple method calls,
priority + FIFO ordering together, and retry/backoff-style logic that's
common in real task queue systems (Celery, SQS, Sidekiq, etc.).
"""


class JobQueue:
    def __init__(self, max_retries: int):
        self.priorityQueue = []
        self.max_retries = max_retries
        self.index = 0
        self.currJobs = {}
        self.permanently_failed = []

    def add_job(self, job_id: str, payload, priority: int = 0) -> None:
        heapq.heappush(self.priorityQueue, (-priority, self.index, {"job_id": job_id, "payload": payload, "priority": priority, "attempts": 0}))
        self.index += 1

    def get_next_job(self):
        if not self.priorityQueue:
            return None
        temp = heapq.heappop(self.priorityQueue)
        job_id = temp[2]["job_id"]
        self.currJobs[job_id] = temp[2]
        return temp[2]
        

    def mark_failed(self, job_id: str) -> None:
        temp = self.currJobs.pop(job_id)
        temp["attempts"] += 1
        if self.currJobs[job_id]["attempts"] > self.max_retries:
            self.permanently_failed.append(job_id)
        else: 
            priority = temp["priority"]
            self.index += 1
            heapq.heappush(self.priorityQueue, (-priority, self.index, temp))

    def mark_success(self, job_id: str) -> None:
        self.currJobs.pop(job_id)

    def permanently_failed_jobs(self) -> list[str]:
        return self.permanently_failed