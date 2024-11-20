import { Mail, Github, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:davidalexanderdunn@gmail.com',
    icon: Mail,
    label: 'Send email'
  },
  {
    name: 'GitHub',
    href: 'https://github.com/algorhythmic',
    icon: Github,
    label: 'View GitHub profile'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/mrdaviddunn',
    icon: Linkedin,
    label: 'View LinkedIn profile'
  },
  {
    name: 'X',
    href: 'https://x.com/mrdaviddunn',
    icon: Twitter,
    label: 'Follow on X'
  },
]

interface SocialLinksProps {
  className?: string
  iconClassName?: string
}

export function SocialLinks({ className = '', iconClassName = 'h-5 w-5' }: SocialLinksProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {socialLinks.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          size="icon"
          className="hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          asChild
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            <item.icon className={iconClassName} />
          </a>
        </Button>
      ))}
    </div>
  )
}
