// This defines the lifecycle of a job posting.

namespace backend.Enums
{
    public enum JobStatus
    {
        Open,       // Accepting new candidates
        OnHold,     // Temporarily paused
        InProgress, // Actively interviewing, not accepting new candidates
        Closed      // Filled or cancelled
    }
}