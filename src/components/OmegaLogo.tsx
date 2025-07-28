import * as React from 'react';

const OmegaLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100" // Ancho por defecto, se puede sobrescribir con props
    height="100" // Alto por defecto, se puede sobrescribir con props
    {...props} // Propaga cualquier prop SVG adicional (como className, style, etc.)
  >
    {/* Círculo exterior blanco/gris claro como fondo */}
    <circle cx="50" cy="50" r="48" fill="#F0F0F0" /> {/* Gris claro */}

    {/* Círculo central azul oscuro */}
    <circle cx="50" cy="50" r="30" fill="#1A237E" /> {/* Azul Oscuro */}

    {/* Elipse 1 (órbita) - Turquesa */}
    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(-30 50 50)" stroke="#00BCD4" strokeWidth="3" fill="none" /> {/* Turquesa */}

    {/* Elipse 2 (órbita) - Morado */}
    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(30 50 50)" stroke="#6A1B9A" strokeWidth="3" fill="none" /> {/* Morado */}

    {/* Círculo exterior más delgado - Azul Oscuro */}
    <circle cx="50" cy="50" r="40" stroke="#1A237E" strokeWidth="2" fill="none" /> {/* Azul Oscuro */}

    {/* Electrones (pequeños círculos) */}
    {/* Posicionados para simular el movimiento alrededor del centro */}
    <circle cx="28" cy="58" r="5" fill="#00BCD4" /> {/* Turquesa */}
    <circle cx="72" cy="42" r="5" fill="#FFFFFF" /> {/* Blanco */}
    <circle cx="28" cy="42" r="5" fill="#6A1B9A" /> {/* Morado */}
    <circle cx="72" cy="58" r="5" fill="#FFFFFF" /> {/* Blanco */}
    <circle cx="50" cy="10" r="5" fill="#00BCD4" /> {/* Turquesa */}
    <circle cx="50" cy="90" r="5" fill="#FFFFFF" /> {/* Blanco */}
  </svg>
);

export default OmegaLogo;
