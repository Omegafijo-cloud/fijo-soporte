// lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function hexToRgbString(hex) {
    let r = 0, g = 0, b = 0;
    // Handle short hex codes
    if (hex.length === 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    } else if (hex.length === 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    return `${+r}, ${+g}, ${+b}`;
}

export function rgbStringToHex(rgbString) {
    if (!rgbString || typeof rgbString !== 'string') return '#000000';
    // Remove "rgb(", "rgba(", ")" and split by comma
    const parts = rgbString.replace(/rgba?\\(([^)]+)\\)/, '$1').split(',').map(Number);
    // Ensure we only take the first 3 parts (R, G, B)
    const [r, g, b] = parts;
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000'; // Fallback for invalid input

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export const copyToClipboard = async (text, message, setAlert) => {
    try {
        await navigator.clipboard.writeText(text);
        setAlert({ isOpen: true, message: message });
    } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
        setAlert({ isOpen: true, message: 'Error al copiar. Por favor, intente de nuevo.' });
    }
};
