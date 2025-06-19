import React from 'react'
import { Building2, User } from 'lucide-react'

interface LogoPlaceholderProps {
  name: string
  type?: 'organization' | 'person'
  className?: string
}

const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({ 
  name, 
  type = 'organization',
  className = "w-full h-full"
}) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className={`${className} bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg flex items-center justify-center`}>
      <div className="text-center">
        {type === 'organization' ? (
          <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
        ) : (
          <User className="w-8 h-8 text-primary mx-auto mb-2" />
        )}
        <div className="text-lg font-bold text-primary">{initials}</div>
      </div>
    </div>
  )
}

export default LogoPlaceholder
