export default function SocialCampaignPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            MagicReel V3
          </p>

          <h1 className="mt-3 text-5xl font-light tracking-tight">
            Social Campaign
          </h1>

          <p className="mt-4 max-w-3xl text-neutral-400 text-lg leading-relaxed">
            AI-powered luxury fashion campaign direction with
            editorial intelligence, cinematic coherence, and
            multi-asset campaign orchestration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Editorial World
            </p>

            <h2 className="mt-3 text-2xl font-light">
              Dark Aristocracy
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Sculptural luxury portraiture with cinematic
              darkness, emotional restraint, and museum-grade
              couture atmosphere.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Campaign Outputs
            </p>

            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" defaultChecked />
                Hero Campaign
              </label>

              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" defaultChecked />
                Instagram Post
              </label>

              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" />
                Story Asset
              </label>

              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" />
                Reel
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Campaign DNA
            </p>

            <div className="mt-4 space-y-3 text-sm text-neutral-400">
              <p>• Cinematic darkness</p>

              <p>• Sculptural lighting</p>

              <p>• Editorial restraint</p>

              <p>• Luxury negative space</p>

              <p>• Monochrome governance</p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Generation
              </p>

              <h2 className="mt-2 text-3xl font-light">
                Build Luxury Campaign
              </h2>
            </div>

            <button className="rounded-full border border-white px-8 py-3 text-sm uppercase tracking-[0.2em] transition hover:bg-white hover:text-black">
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}