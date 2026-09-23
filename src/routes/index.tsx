import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RingViewer, type ViewerMode } from "@/components/RingViewer";
import { RingThumbnails } from "@/components/RingThumbnails";
import { CartDrawer } from "@/components/CartDrawer";
import { SiteHeader } from "@/components/SiteHeader";
import { ActionBar } from "@/components/ActionBar";
import { ContactCard } from "@/components/ContactCard";
import {
  CrownSettingSelector,
  DiamondShapeSelector,
  DiamondSizeSlider,
  MetalKaratAndSize,
  MetalSelector,
  RingStyleSelector,
  SideSettingSelector,
} from "@/components/Selectors";
import { useRingConfiguration } from "@/hooks/useRingConfiguration";
import { useCart } from "@/hooks/useCart";
import { DIAMOND_SHAPES, CARAT_STEPS } from "@/data/diamondOptions";
import { RING_STYLES, SIDE_SETTINGS, CROWN_SETTINGS } from "@/data/ringOptions";
import { whatsappLink } from "@/data/contact";
import { enquiryMessage } from "@/utils/enquiry";
import { configUrl } from "@/utils/urlState";

const TITLE = "Custom Ring Studio | Starlink Jewels";
const DESCRIPTION =
  "Design your own engagement ring with Starlink Jewels: choose shape, carat, setting and metal in a real-time 3D preview, then enquire for a quote.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RingBuilderPage,
});

function RingBuilderPage() {
  const { configuration, assets, setConfiguration, title } = useRingConfiguration();
  const { items, addItem, removeItem, clear, count } = useCart();
  const [mode, setMode] = useState<ViewerMode>("360");
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const label = useCallback(
    (list: readonly { value: string; label: string }[], value: string) =>
      list.find((o) => o.value === value)?.label ?? value,
    [],
  );

  const selections = useMemo(
    () => ({
      Shape: label(DIAMOND_SHAPES, configuration.diamondShape),
      Carat: label(CARAT_STEPS, configuration.centerDiamondSize),
      Style: label(RING_STYLES, configuration.ringStyle),
      Side: label(SIDE_SETTINGS, configuration.sideSetting),
      Crown: label(CROWN_SETTINGS, configuration.crownSetting),
      Metal: `${configuration.metalKarat.toUpperCase()} ${configuration.metal}`,
      Size: configuration.ringSize,
    }),
    [configuration, label],
  );

  const onAddToCart = useCallback(() => {
    addItem({
      title,
      configuration,
      selections,
      sku: assets.variantSku,
    });
    setAdded(true);
    setCartOpen(true);
    window.setTimeout(() => setAdded(false), 2400);
  }, [addItem, title, configuration, selections, assets.variantSku]);

  // Read from window, so only after hydration: rendering it on the server
  // would give the enquiry link a different href on each side.
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => setShareUrl(configUrl(configuration)), [configuration]);

  const enquiryHref = useMemo(
    () =>
      whatsappLink(
        enquiryMessage([
          { title, selections, sku: assets.variantSku, link: shareUrl || undefined },
        ]),
      ),
    [title, selections, assets.variantSku, shareUrl],
  );

  const summary = `${selections.Carat} ${selections.Shape} · ${selections.Metal}`;

  const props = { configuration, set: setConfiguration };

  return (
    <div className="studio">
      <SiteHeader cartCount={count} onOpenCart={() => setCartOpen(true)} />

      <main className="studio__body">
        <section className="stage" aria-label="Ring preview">
          <div className="stage__inner">
            <div className="stage__frame">
              <RingViewer
                models={assets.models}
                mode={mode}
                metal={configuration.metal}
                onModeChange={setMode}
              />
            </div>
          </div>
          {/* Sibling of the stage, not a child of it: on desktop this is pinned
              beside the ring, on mobile it flows underneath. */}
          <RingThumbnails mode={mode} onSelect={setMode} />
          <div className="stage__foot">
            <span>Real-time 3D</span>
            <i aria-hidden />
            <span>Made to order</span>
            <i aria-hidden />
            <span>Certified diamonds</span>
          </div>
        </section>

        <section className="config" id="configuration" aria-label="Ring configuration">
          <div className="config__scroll">
            <header className="config__head">
              <p className="eyebrow">Bespoke · Design your own</p>
              <h1 className="config__title" data-testid="ring-title">
                {title}
              </h1>
              <p className="config__sub">
                A considered balance of light, proportion and precious metal — shaped entirely by
                you.
              </p>
              <ul className="spec" aria-label="Current selections">
                <li>{selections.Shape}</li>
                <li>{selections.Carat}</li>
                <li>{selections.Metal}</li>
                <li>Size {selections.Size}</li>
              </ul>
            </header>

            <div className="config__sections">
              <RingStyleSelector {...props} />
              <SideSettingSelector {...props} />
              <DiamondShapeSelector {...props} />
              <DiamondSizeSlider {...props} />
              <CrownSettingSelector {...props} />
              <MetalSelector {...props} />
              <MetalKaratAndSize {...props} />
            </div>

            <ContactCard
              enquiryHref={enquiryHref}
              subject={`Ring Studio enquiry — ${assets.variantSku}`}
            />
          </div>

          <ActionBar
            summary={summary}
            sku={assets.variantSku}
            added={added}
            enquiryHref={enquiryHref}
            onAddToCart={onAddToCart}
          />
        </section>
      </main>

      <CartDrawer
        open={cartOpen}
        items={items}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onClear={clear}
      />
    </div>
  );
}
