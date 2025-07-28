import * as React from 'react';

const OmegaLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    {...props}
  >
    {/* Círculo exterior gris claro como fondo */}
    <circle cx="50" cy="50" r="48" fill="#F0F0F0" />

    {/* Círculo central azul oscuro */}
    <circle cx="50" cy="50" r="30" fill="#1A237E" />

    {/* Elipse 1 (órbita) - Turquesa */}
    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(-30 50 50)" stroke="#00BCD4" strokeWidth="3" fill="none" />

    {/* Elipse 2 (órbita) - Morado */}
    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(30 50 50)" stroke="#6A1B9A" strokeWidth="3" fill="none" />

    {/* Círculo exterior más delgado - Azul Oscuro */}
    <circle cx="50" cy="50" r="40" stroke="#1A237E" strokeWidth="2" fill="none" />

    {/* Electrones (pequeños círculos) */}
    <circle cx="28" cy="58" r="5" fill="#00BCD4" />
    <circle cx="72" cy="42" r="5" fill="#FFFFFF" />
    <circle cx="28" cy="42" r="5" fill="#6A1B9A" />
    <circle cx="72" cy="58" r="5" fill="#FFFFFF" />
    <circle cx="50" cy="10" r="5" fill="#00BCD4" />
    <circle cx="50" cy="90" r="5" fill="#FFFFFF" />
  </svg>
);

export default OmegaLogo;

    