# Data Retention and PII Handling Policy

**Last Updated:** 2026-02-06
**Status:** Active

## 1. Overview

This document defines the data retention periods, Personally Identifiable Information (PII) handling, and access control policies for the `autopilotreels` platform. It ensures compliance with generally accepted privacy standards for an MVP scope.

## 2. PII Identification

The following data fields are classified as PII:

| Table | Field | Classification | Purpose |
|Data Source| Field | Classification | Purpose |
|---|---|---|---|
| `payments` | `email` | **High Sensitivity PII** | Receipt delivery, account recovery, user linking. |
| `users` (Auth) | `email` | **High Sensitivity PII** | Authentication, communication. |
| `payments` | `stripe_customer_id` | **Medium Sensitivity** | External payment provider linkage. |

**Note on Metadata:**

- The `events` table `metadata` column **MUST NOT** store PII (e.g., email, names). It should only contain non-identifying attributes (e.g., `price_id`, `plan_type`).
- `stripe_session_id` is considered pseudonymous but treated with care as it links to Stripe PII.

## 3. Data Retention Periods

| Data Category        | Retention Period       | Rationale                        | Action at Expiry       |
| -------------------- | ---------------------- | -------------------------------- | ---------------------- |
| **Payment Records**  | 7 Years                | Tax and accounting compliance.   | Archived / Anonymized  |
| **User Accounts**    | Until Deletion Request | Service provision.               | Hard Delete            |
| **Analytics Events** | 2 Years                | Historical trend analysis.       | Aggregated & Deleted   |
| **Server Logs**      | 30 Days                | Debugging and security auditing. | Auto-rotated / Deleted |

## 4. Access Control

Access to PII is strictly controlled via Supabase Row Level Security (RLS) and application-level checks.

- **Service Role:** Full access (Backend API only). Used for webhook processing and linking.
- **Authenticated Users:** Can only read their **own** linked payment records and event data (if applicable).
- **Admins:** Access to aggregate data and specific PII (email lists) is restricted to accounts with emails in `ADMIN_EMAILS` (application-level check).
- **Public:** No access to PII.

## 5. Deletion Requests

Upon user request (verified via email):

1. **User Table:** Account deleted from Supabase Auth.
2. **Payment Links:** `user_payment_links` entries removal breaks the link to app utility.
3. **Payment Records:** Retained for tax purposes but marked as "orphaned" or restricted.
4. **Events:** `user_id` is set to NULL or random UUID to anonymize history.

## References

- [Architecture: Data Architecture](./architecture.md#data-architecture)
- [Supabase RLS Policies](../supabase/migrations/20260204000100_core_tables.sql)
