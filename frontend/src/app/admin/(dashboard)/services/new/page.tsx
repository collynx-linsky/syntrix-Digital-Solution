import { ServiceForm } from "@/components/admin/forms/service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-950 dark:text-white">New Service</h1>
      <ServiceForm />
    </div>
  );
}
