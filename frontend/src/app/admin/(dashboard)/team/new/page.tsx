import { TeamMemberForm } from "@/components/admin/forms/team-member-form";

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Team Member</h1>
      <TeamMemberForm />
    </div>
  );
}
