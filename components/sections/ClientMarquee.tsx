import Image from 'next/image';
import Marquee from '@/components/ui/Marquee';

export interface ClientLogo {
  name: string;
  logoUrl: string;
}

export default function ClientMarquee({ logos }: { logos: ClientLogo[] }) {
  if (!logos?.length) return null;
  return (
    <section className="w-full bg-bg py-10">
      <Marquee speed={35}>
        {logos.map((logo) => (
          <div key={logo.name} className="flex h-[60px] items-center opacity-80 grayscale">
            <Image src={logo.logoUrl} alt={logo.name} width={140} height={60} className="object-contain" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
