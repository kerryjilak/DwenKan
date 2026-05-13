export default function DwenKanLogo({ size = 32, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      {/* Background */}
      <circle cx="32" cy="32" r="30" fill="url(#dkBg)" stroke="url(#dkBorder)" strokeWidth="2.5"/>
      
      {/* Adinkra Dwennimmen spirals as neural pathways */}
      <path d="M20 32 C20 24, 28 20, 32 24 C36 28, 28 32, 24 32" 
            stroke="url(#dkGold)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M20 32 C20 40, 28 44, 32 40 C36 36, 28 32, 24 32" 
            stroke="url(#dkGold)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M44 32 C44 24, 36 20, 32 24 C28 28, 36 32, 40 32" 
            stroke="url(#dkGold)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M44 32 C44 40, 36 44, 32 40 C28 36, 36 32, 40 32" 
            stroke="url(#dkGold)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Neural nodes */}
      <circle cx="32" cy="24" r="3" fill="#F59E0B"/>
      <circle cx="32" cy="40" r="3" fill="#F59E0B"/>
      <circle cx="20" cy="32" r="2.5" fill="#A78BFA"/>
      <circle cx="44" cy="32" r="2.5" fill="#A78BFA"/>
      <circle cx="32" cy="32" r="3.5" fill="#E0E7FF" stroke="#6366f1" strokeWidth="1.5"/>
      
      {/* Spike lines */}
      <line x1="32" y1="16" x2="32" y2="12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="48" x2="32" y2="52" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="32" x2="10" y2="32" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="50" y1="32" x2="54" y2="32" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Synapse dots */}
      <circle cx="26" cy="26" r="1.5" fill="#818CF8" opacity="0.7"/>
      <circle cx="38" cy="26" r="1.5" fill="#818CF8" opacity="0.7"/>
      <circle cx="26" cy="38" r="1.5" fill="#818CF8" opacity="0.7"/>
      <circle cx="38" cy="38" r="1.5" fill="#818CF8" opacity="0.7"/>
      
      <defs>
        <radialGradient id="dkBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e1b4b"/>
          <stop offset="100%" stopColor="#0f0a1e"/>
        </radialGradient>
        <linearGradient id="dkBorder" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="50%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
        <linearGradient id="dkGold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#FBBF24"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
