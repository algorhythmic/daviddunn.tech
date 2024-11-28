import Image from 'next/image';

export default function TechFooter() {
  const technologies = [
    {
      name: 'TypeScript',
      icon: '/icons/typescript.svg',
      color: '#3178C6'
    },
    {
      name: 'Next.js',
      icon: '/icons/nextjs.svg',
      color: '#000000',
      needsBackground: true
    },
    {
      name: 'Tailwind CSS',
      icon: '/icons/tailwind.svg',
      color: '#38B2AC'
    },
    {
      name: 'shadcn/ui',
      icon: '/icons/shadcn.svg',
      color: '#000000',
      needsBackground: true
    },
    {
      name: 'Node.js',
      icon: '/icons/nodejs.svg',
      color: '#339933'
    },
    {
      name: 'Supabase',
      icon: '/icons/supabase.svg',
      color: '#3ECF8E'
    },
    {
      name: 'MongoDB',
      icon: '/icons/mongodb-leaf.svg',
      color: '#47A248'
    },
    {
      name: 'AWS',
      icon: '/icons/aws.svg',
      color: '#FF9900'
    }
  ];

  return (
    <footer className="w-full py-8 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Powered by:</span>
          <div className="flex items-center gap-3">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="relative group"
                title={tech.name}
              >
                <div className={`w-6 h-6 flex items-center justify-center ${tech.needsBackground ? 'bg-white rounded-full p-0.5' : ''}`}>
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={24}
                    height={24}
                    style={{ width: 'auto', height: 'auto' }}
                    className={`transition-transform hover:scale-110 ${tech.name === 'MongoDB' ? 'scale-75' : ''}`}
                  />
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-popover px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
