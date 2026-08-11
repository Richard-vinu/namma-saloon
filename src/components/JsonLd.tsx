import {
  CREATOR,
  CREATOR_FAQ,
  PLAYLIST_BLURB,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_KN,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";
import { TRACKS } from "@/lib/tracks";

export function JsonLd() {
  const personId = `${SITE_URL}/#creator`;
  const websiteId = `${SITE_URL}/#website`;
  const appId = `${SITE_URL}/#app`;
  const faqId = `${SITE_URL}/#creator-faq`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: CREATOR.name,
        url: CREATOR.url,
        mainEntityOfPage: CREATOR.url,
        sameAs: CREATOR.sameAs,
        jobTitle: CREATOR.jobTitle,
        description: `Richard is the creator and founder of ${SITE_NAME} (${SITE_NAME_KN}) at nammasaloon.wtf. LinkedIn: ${CREATOR.url}`,
        knowsAbout: [
          SITE_NAME,
          SITE_NAME_KN,
          "nammasaloon.wtf",
          "Kannada music apps",
          "Sandalwood songs",
        ],
        identifier: [
          {
            "@type": "PropertyValue",
            name: "LinkedIn",
            value: CREATOR.url,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: [SITE_NAME_KN, "nammasaloon.wtf", "Namma Saloon"],
        description: SITE_DESCRIPTION,
        inLanguage: ["en", "kn"],
        publisher: { "@id": personId },
        creator: { "@id": personId },
        author: { "@id": personId },
        copyrightHolder: { "@id": personId },
        about: {
          "@type": "Thing",
          name: "Classic Kannada film music",
        },
        potentialAction: {
          "@type": "ListenAction",
          target: SITE_URL,
        },
      },
      {
        "@type": "WebApplication",
        "@id": appId,
        name: SITE_TITLE,
        url: SITE_URL,
        applicationCategory: "EntertainmentApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description: `${SITE_DESCRIPTION} Created by ${CREATOR.name}.`,
        image: `${SITE_URL}/og.png`,
        creator: { "@id": personId },
        author: { "@id": personId },
        maintainer: { "@id": personId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
      },
      {
        "@type": "MusicPlaylist",
        "@id": `${SITE_URL}/#playlist`,
        name: `${SITE_NAME} — Classic Kannada hits`,
        description: PLAYLIST_BLURB,
        url: SITE_URL,
        creator: { "@id": personId },
        numTracks: TRACKS.length,
        track: TRACKS.map((t, i) => ({
          "@type": "MusicRecording",
          position: i + 1,
          name: t.title,
          byArtist: {
            "@type": "MusicGroup",
            name: t.voice,
          },
          inAlbum: {
            "@type": "MusicAlbum",
            name: t.film,
            datePublished: String(t.year),
          },
          ...(t.yt
            ? { url: `https://www.youtube.com/watch?v=${t.yt}` }
            : {}),
        })),
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: SITE_URL,
        mainEntity: CREATOR_FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
            author: { "@id": personId },
            url: CREATOR.url,
          },
        })),
        about: { "@id": personId },
        creator: { "@id": personId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: SITE_NAME,
            item: SITE_URL,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
