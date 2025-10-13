// This defines the possible stages for a candidate within a specific job's pipeline.

namespace backend.Enums
{
    public enum ApplicationStatus
    {
        Submitted,
        UnderReview,
        ScheduledForInterview,
        OfferExtended,
        Hired,
        Rejected
    }
}