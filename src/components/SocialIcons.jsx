// Authentic full-color brand SVG icons for Facebook, Instagram, Twitter/X, and WhatsApp

export function IconInstagram({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="ig-gradient-fill" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="5.5" fill="url(#ig-gradient-fill)" />
      <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="4" stroke="#FFFFFF" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth="1.75" />
      <circle cx="16.1" cy="7.9" r="0.9" fill="#FFFFFF" />
    </svg>
  )
}

export function IconFacebook({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.5 12.05h-2.32v8.95h-3.7V12.05H7.72V8.91h1.76V6.87c0-2.45 1.46-3.87 3.73-3.87 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.22 0-1.6.76-1.6 1.54v1.71h2.77l-.44 3.14z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function IconTwitter({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="5.5" fill="#1DA1F2" />
      <path
        d="M19 7.5a6.5 6.5 0 01-1.87.51 3.26 3.26 0 001.43-1.8 6.53 6.53 0 01-2.07.79 3.25 3.25 0 00-5.54 2.97 9.23 9.23 0 01-6.7-3.4 3.26 3.26 0 001.01 4.34 3.22 3.22 0 01-1.47-.4v.04a3.26 3.26 0 002.61 3.19 3.26 3.26 0 01-1.47.06 3.26 3.26 0 003.04 2.26 6.53 6.53 0 01-4.04 1.39A6.64 6.64 0 013 19.34a9.21 9.21 0 004.99 1.46c5.99 0 9.27-4.96 9.27-9.27 0-.14 0-.28-.01-.42A6.62 6.62 0 0019 7.5z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function IconX({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="5.5" fill="#000000" />
      <path
        d="M17.2 5h2.17l-4.74 5.42 5.58 7.38H15.8l-3.42-4.47-3.95 4.47H6.26l5.07-5.8L6 5h4.52l3.09 4.09L17.2 5zm-.76 11.5h1.2L9.43 6.24H8.14l8.3 10.26z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function IconWhatsApp({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="5.5" fill="#25D366" />
      <path
        d="M12 4.5C7.858 4.5 4.5 7.858 4.5 12c0 1.34.348 2.596.957 3.685L4.5 19.5l3.923-.942A7.453 7.453 0 0012 19.5c4.142 0 7.5-3.358 7.5-7.5S16.142 4.5 12 4.5zm4.37 10.38c-.183.514-.906.94-1.49 1.064-.397.085-.916.152-2.66-.57-2.237-.914-3.68-3.19-3.793-3.338-.11-.147-.9-1.197-.9-2.283s.554-1.62.773-1.844c.183-.187.486-.274.777-.274.095 0 .18.005.256.009.224.01.337.023.485.377.183.444.628 1.53.682 1.641.055.11.11.257.032.404-.073.152-.138.22-.248.347-.11.128-.215.225-.325.362-.1.12-.213.248-.087.472.127.22.563.927 1.207 1.501.83.737 1.5.97 1.746 1.076.184.079.4.062.532-.08.167-.183.373-.488.582-.788.148-.213.337-.24.535-.165.201.072 1.28.603 1.5.713.22.11.366.163.42.254.053.09.053.52-.13 1.033z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

// Map id → component for convenient lookup
export const socialIconMap = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  x: IconX,
  twitter: IconTwitter,
  whatsapp: IconWhatsApp,
}
