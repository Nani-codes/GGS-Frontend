"use client";

import { useTranslations } from "next-intl";

export function VideoSection() {
  const t = useTranslations();

  return (
    <section className="video-one">
      <div
        className="video-one__bg jarallax"
        data-jarallax
        data-speed="0.2"
        data-imgposition="50% 0%"
        style={{ backgroundImage: "url(/assets/images/backgrounds/video-one-bg.jpg)" }}
      />
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="video-one__inner">
              <div className="video-one__video-link">
                <a
                  href="/video/output.html"
                  className="video-popup"
                  aria-label={t("home.video.subtitle")}
                >
                  <div className="video-one__icon">
                    <span className="fa fa-play" />
                    <i className="ripple" />
                  </div>
                </a>
              </div>
              <p className="video-one__sub-title">{t("home.video.subtitle")}</p>
              <h2
                className="video-one__title"
                dangerouslySetInnerHTML={{ __html: t("home.video.title") }}
              />
              <div className="video-one__round-text">
                <div className="video-one__curved-circle">
                  {t("home.video.curvedText") || "Quality Seeds for Better Harvests"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

