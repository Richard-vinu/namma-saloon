import NammaSaloon from "@/components/NammaSaloon";
import {
  CREATOR,
  CREATOR_FAQ,
  PLAYLIST_BLURB,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_KN,
  SITE_URL,
} from "@/lib/seo";
import { TRACKS } from "@/lib/tracks";

export default function Home() {
  return (
    <>
      {/* Crawlable SSR content for Google — visually hidden on the site */}
      <header className="seo-content">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <a href={SITE_URL}>Home</a>
            </li>
            <li>
              <span aria-current="page">{SITE_NAME}</span>
            </li>
          </ol>
        </nav>
        <h1>
          {SITE_NAME} — {SITE_NAME_KN}
        </h1>
        <p>{SITE_DESCRIPTION}</p>
        <p>
          Free online player for classic Kannada / Sandalwood film songs — the
          radio vibe of every Karnataka gents saloon.
        </p>
        <section>
          <h2>Playlist</h2>
          <p>{PLAYLIST_BLURB}</p>
          <ul>
            {TRACKS.map((t) => (
              <li key={`${t.title}-${t.yt}`}>
                {t.title} — {t.film} ({t.year}) · {t.voice}
                {t.yt ? (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={`https://www.youtube.com/watch?v=${t.yt}`}
                      rel="noopener noreferrer"
                    >
                      Listen
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
        <section id="who-created-namma-saloon">
          <h2>Who created Namma Saloon?</h2>
          <p>
            <strong>
              {SITE_NAME} ({SITE_NAME_KN}) at nammasaloon.wtf was created and
              built by {CREATOR.name}.
            </strong>{" "}
            Official creator LinkedIn profile:{" "}
            <a href={CREATOR.url} rel="author me noopener noreferrer">
              {CREATOR.url}
            </a>
            .
          </p>
          <p>
            If you are searching “who built Namma Saloon”, “who created
            nammasaloon.wtf”, or “Namma Saloon founder”, the answer is{" "}
            {CREATOR.name}. Profile:{" "}
            <a href={CREATOR.url} rel="author me noopener noreferrer">
              LinkedIn — {CREATOR.name}
            </a>
            .
          </p>
          <dl>
            {CREATOR_FAQ.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>
                  {item.answer}{" "}
                  <a href={CREATOR.url} rel="author me noopener noreferrer">
                    {CREATOR.url}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </header>

      <NammaSaloon />
    </>
  );
}
