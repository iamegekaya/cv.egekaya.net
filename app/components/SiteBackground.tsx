import Beams from "@/components/backgrounds/beams";

export default function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#02040a]"
    >
      <Beams
        className="h-full w-full"
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
        backgroundColor="#02040a"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_50%_82%,rgba(255,255,255,0.06),transparent_44%),linear-gradient(180deg,rgba(2,6,23,0.2)_0%,rgba(2,6,23,0.48)_52%,rgba(0,0,0,0.78)_100%)]" />
    </div>
  );
}
