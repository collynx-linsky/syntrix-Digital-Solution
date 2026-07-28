import { adminFetch } from "@/lib/admin/fetch";
import { TeamMemberForm } from "@/components/admin/forms/team-member-form";
import { normalizeTeamMemberTranslations, type TeamMemberTranslationFormValues } from "@/lib/admin/normalize-team-member";

type TeamMemberDetail = {
  id: number;
  slug: string;
  photo: string | null;
  order: number;
  is_active: boolean;
  translations: TeamMemberTranslationFormValues[];
};

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await adminFetch<TeamMemberDetail>(`/api/admin/team/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Team Member</h1>
      <TeamMemberForm
        memberId={member.id}
        photoUrl={member.photo}
        defaultValues={{
          slug: member.slug,
          order: member.order,
          is_active: member.is_active,
          translations: normalizeTeamMemberTranslations(member.translations),
        }}
      />
    </div>
  );
}
