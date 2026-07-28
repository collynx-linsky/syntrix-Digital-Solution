import { adminFetch } from "@/lib/admin/fetch";
import { ServiceForm } from "@/components/admin/forms/service-form";
import { normalizeServiceTranslations } from "@/lib/admin/normalize-service";

type ServiceTranslation = {
  language_code: string;
  status: string;
  title: string;
  summary: string;
  description: string;
  features: string[];
  seo_title: string;
  seo_description: string;
};

type ServiceDetail = {
  id: number;
  slug: string;
  icon: string;
  order: number;
  is_active: boolean;
  translations: ServiceTranslation[];
};

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await adminFetch<ServiceDetail>(`/api/admin/services/${id}/`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">Edit Service</h1>
      <ServiceForm
        serviceId={service.id}
        defaultValues={{
          slug: service.slug,
          icon: service.icon,
          order: service.order,
          is_active: service.is_active,
          translations: normalizeServiceTranslations(service.translations),
        }}
      />
    </div>
  );
}
