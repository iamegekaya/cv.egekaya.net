import LightPillar from "@/components/backgrounds/light-pillar";

export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <LightPillar />
    </div>
  );
}
