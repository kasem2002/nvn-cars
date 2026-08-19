import { useGetSettingsQuery } from "@/services/api";

/**
 * Renders the real NVN Cars logo once uploaded via the dashboard (settings.logo).
 * Falls back to a styled wordmark built from the brand's typography and red
 * accent, so navigation/footer never show a broken image in the meantime.
 */
export function Logo({ className = "" }: { className?: string }) {
  const { data: settings } = useGetSettingsQuery();

  if (settings?.logo) {
    return <img src={settings.logo} alt="NVN Cars" className={className} />;
  }

  return (
    <span className={`inline-flex items-baseline font-display tracking-[0.08em] ${className}`}>
      <span className="text-nvn-white">NV</span>
      <span className="text-nvn-red">N</span>
    </span>
  );
}
