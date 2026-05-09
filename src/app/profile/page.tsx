import Link from "next/link";
import StatsCard from "@/components/dashboard/stats-card";
import SupportHistoryList from "@/components/donations/support-history-list";
import ProfileForm from "@/components/profile/profile-form";
import { getCurrentProfilePageData } from "@/features/profiles/queries";

export default async function ProfilePage() {
  const { user, profile, donationActivity } = await getCurrentProfilePageData();

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="mt-3 text-muted-foreground">
            You must be logged in to access your profile.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold">My profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information, contact details, and profile photo.
        </p>
      </section>

      <ProfileForm user={user} profile={profile} />

      {donationActivity ? (
        <>
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold">Support activity</h2>
              <p className="text-muted-foreground">
                A quick summary of what you funded and what your projects
                received.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                label="You pledged"
                value={`$${donationActivity.totalSentAmount}`}
                helper="Total amount you supported"
              />
              <StatsCard
                label="Payments made"
                value={String(donationActivity.sentPaymentsCount)}
                helper="Your successful support payments"
              />
              <StatsCard
                label="Received"
                value={`$${donationActivity.totalReceivedAmount}`}
                helper="Across all your projects"
              />
              <StatsCard
                label="Supporters"
                value={String(donationActivity.receivedPaymentsCount)}
                helper="People who backed your projects"
              />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <SupportHistoryList
              title="Payments you made"
              description="Your latest support payments as a backer."
              counterpartyLabel="Creator"
              emptyTitle="No payments yet"
              emptyDescription="Support a project to start building your payment history."
              items={donationActivity.sentHistory}
            />
            <SupportHistoryList
              title="Payments received"
              description="Your latest incoming support as a creator."
              counterpartyLabel="Supporter"
              emptyTitle="No incoming payments yet"
              emptyDescription="When someone supports one of your projects, it will appear here."
              items={donationActivity.receivedHistory}
            />
          </section>
        </>
      ) : null}
    </main>
  );
}
