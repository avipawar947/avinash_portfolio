import Image from "next/image";
import type { ProjectItem } from "@/types/content";

/** Card + hero media: image OR video, driven by CMS mediaType. */
export default function Media({
  project,
  sizes = "80vw",
  className = "object-cover",
  priority = false,
}: {
  project: ProjectItem;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const isVideo = project.mediaType === "video" && !!project.videoUrl;
  if (isVideo) {
    return (
      <video
        src={project.videoUrl}
        poster={project.videoPosterUrl || project.imageUrl || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full ${className}`}
        aria-label={project.title}
      />
    );
  }
  const src = project.imageUrl || project.caseStudy?.heroImageUrl || "";
  if (!src) return <span className="absolute inset-0 block size-full bg-[#131313]" aria-hidden />;
  return (
    <Image
      src={src}
      alt={project.title}
      fill
      sizes={sizes}
      priority={priority}
      className={`absolute inset-0 ${className}`}
      style={{ objectPosition: `center ${project.cropTop ?? 0}%` }}
    />
  );
}
