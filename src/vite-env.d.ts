/// <reference types="vite/client" />

/** true im Single-File-Build (kein Service Worker, keine externen Assets). */
declare const __SINGLE__: boolean;

/** Datum und Kurzfassung des Standes, gesetzt beim Bauen (vite.config.ts). */
declare const __BAU__: string;
