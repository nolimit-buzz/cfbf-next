/** Turns a youtu.be / youtube.com/watch URL into an embeddable youtube.com/embed URL. Returns null if the URL isn't recognized. */
function toYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.endsWith('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // not a valid URL — fall through to null
  }
  return null;
}

/** Renders a story's media area: the real embedded YouTube player if it has a video, otherwise the fallback image. */
export default function StoryMedia({
  story,
}: {
  story: { image: string; image_alt_text: string | null; title: string; youtubeUrl: string | null };
}) {
  const embedUrl = story.youtubeUrl ? toYoutubeEmbedUrl(story.youtubeUrl) : null;

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={story.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <img
      src={story.image}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      alt={story.image_alt_text ?? story.title}
    />
  );
}
