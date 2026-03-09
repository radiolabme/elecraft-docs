// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';

// GitHub Pages configuration
const GITHUB_USER = 'radiolabme';
const REPO_NAME = 'elecraft-docs';
const IS_USER_SITE = false;

export default defineConfig({
  site: `https://${GITHUB_USER}.github.io`,
  base: IS_USER_SITE ? '/' : `/${REPO_NAME}`,
  integrations: [
    starlight({
      plugins: [starlightClientMermaid()],
      title: 'Elecraft K3 Docs',
      description:
        'Complete documentation library for the Elecraft K3 and K3S transceiver, options, modifications, and accessories',
      favicon: '/favicon.svg',
      lastUpdated: true,
      editLink: {
        baseUrl: `https://github.com/${GITHUB_USER}/${REPO_NAME}/edit/main/`,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: `https://github.com/${GITHUB_USER}/${REPO_NAME}`,
        },
      ],
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:type',
            content: 'website',
          },
        },
      ],
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [{ label: 'Introduction', slug: 'index' }],
        },
        {
          label: 'K3 Transceiver',
          items: [
            { label: 'Overview', slug: 'k3' },
            { label: 'Options & Upgrades', slug: 'k3/options' },
            { label: 'Modifications & App Notes', slug: 'k3/modifications' },
          ],
        },
        {
          label: 'K3S Transceiver',
          items: [
            { label: 'Overview', slug: 'k3s' },
            { label: 'Options & Upgrades', slug: 'k3s/options' },
            { label: 'Modifications & App Notes', slug: 'k3s/modifications' },
          ],
        },
        {
          label: 'KPA500 Amplifier',
          items: [
            { label: 'Overview', slug: 'kpa500' },
            { label: 'Radio Interconnects', slug: 'kpa500/interconnects' },
          ],
        },
        {
          label: 'KAT500 Tuner',
          items: [{ label: 'Overview', slug: 'kat500' }],
        },
        {
          label: 'Accessories',
          items: [
            { label: 'K144XV 2M Transverter', slug: 'accessories/k144xv' },
            { label: 'P3 Panadapter', slug: 'accessories/p3' },
            { label: 'SP3 Internal Speaker', slug: 'accessories/sp3' },
            { label: 'XV Transverters', slug: 'accessories/xv' },
          ],
        },
        {
          label: 'Programming Guide',
          items: [
            { label: 'Overview', slug: 'programming' },
            { label: 'Connection & Discovery', slug: 'programming/connection' },
            {
              label: 'Frequency & Modes',
              slug: 'programming/frequency-modes',
            },
            { label: 'Receiver Control', slug: 'programming/receiver' },
            { label: 'Transmitter Control', slug: 'programming/transmitter' },
            { label: 'Voice, CW & Data', slug: 'programming/voice-cw-data' },
            { label: 'Advanced Features', slug: 'programming/advanced' },
            { label: 'Event Handling', slug: 'programming/events' },
            { label: 'Error Handling', slug: 'programming/errors' },
            { label: 'KPA500 Integration', slug: 'programming/kpa500' },
            { label: 'KAT500 Integration', slug: 'programming/kat500' },
            { label: 'Station Integration', slug: 'programming/station' },
          ],
        },
        {
          label: 'Reference',
          items: [
            {
              label: 'K3/K3S/KX3/KX2 Commands',
              slug: 'reference/k3-commands',
            },
            { label: 'P3 Commands', slug: 'reference/p3-commands' },
            { label: 'KPA500 Commands', slug: 'reference/kpa500-commands' },
            { label: 'KAT500 Commands', slug: 'reference/kat500-commands' },
            { label: 'Schematic Downloads', slug: 'reference/schematics' },
            {
              label: "Programmer's Reference PDFs",
              slug: 'reference/programmers-ref',
            },
            { label: 'Fred Cady Books', slug: 'reference/fred-cady' },
            { label: 'Document Index', slug: 'document-index' },
          ],
        },
      ],
    }),
  ],
});
