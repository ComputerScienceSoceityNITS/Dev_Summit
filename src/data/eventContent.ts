/**
 * Dev Summit Event Content Configuration
 * 
 * ORGANIZERS NOTE:
 * Update this single file to change all event details, dates, venue, speakers,
 * tracks, sponsors, and links across the entire website.
 * Unconfirmed items have explicit placeholder flags and values.
 */

export interface EventHeroConfig {
  eventName: string;
  tagline: string;
  themeMotto: string;
  callout: string;
  statusBadge: string;
  scrollCueText: string;
  loaderLabel: string;
}

export interface EventMetadata {
  edition: string;
  year: string;
  dates: {
    display: string;
    isConfirmed: boolean;
    startDatePlaceholder: string;
    endDatePlaceholder: string;
    timezone: string;
  };
  venue: {
    name: string;
    city: string;
    address: string;
    isConfirmed: boolean;
    mapPlaceholderUrl: string;
  };
  organizer: {
    name: string;
    community: string;
    contactEmail: string;
    socials: {
      platform: string;
      url: string; // Placeholder if not configured
      isConfigured: boolean;
    }[];
  };
}

export interface TrackItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'Cpu' | 'Sparkles' | 'Cloud' | 'Shield' | 'Boxes' | 'Terminal';
  highlights: string[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  trackId: string;
  trackLabel: string;
  title: string;
  speakerName: string;
  speakerRole: string;
  speakerCompany: string;
  type: 'Keynote' | 'Breakout' | 'Workshop' | 'Panel' | 'Networking';
  location: string;
  isConfirmed: boolean;
}

export interface SpeakerItem {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  specialty: string;
  isConfirmed: boolean;
  avatarPlaceholder: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface SponsorTier {
  id: string;
  tierName: string;
  description: string;
  badgeColor: 'cyan' | 'orange' | 'amber' | 'slate';
  sponsors: {
    id: string;
    name: string;
    isConfirmed: boolean;
    logoPlaceholder: string;
    websiteUrl: string;
  }[];
}

export interface RegistrationConfig {
  isRegistrationLive: boolean;
  comingSoonText: string;
  registrationDestinationUrl: string | null;
  earlyAccessFormTitle: string;
  earlyAccessFormSubtitle: string;
  tickets: {
    id: string;
    tier: string;
    priceDisplay: string;
    features: string[];
    status: 'Coming Soon' | 'Waitlist Open' | 'Sold Out';
    recommended?: boolean;
  }[];
}

export const HERO_CONTENT: EventHeroConfig = {
  // EXACT REQUIRED STRINGS:
  eventName: 'DEV SUMMIT',
  tagline: 'BUILD THE FUTURE',
  themeMotto: 'CODE. CREATE. TRANSFORM.',
  callout: 'CALLING ALL AUTOBOTS',
  statusBadge: 'DEV SUMMIT COMING SOON',
  scrollCueText: 'SCROLL TO TRANSFORM',
  loaderLabel: 'ASSEMBLING THE EXPERIENCE',
};

export const EVENT_METADATA: EventMetadata = {
  edition: 'Cybertron Edition',
  year: '2026',
  dates: {
    display: '[EVENT DATE TO BE ANNOUNCED]',
    isConfirmed: false,
    startDatePlaceholder: '2026-Q4-TBD',
    endDatePlaceholder: '2026-Q4-TBD',
    timezone: 'UTC/Local',
  },
  venue: {
    name: '[OFFICIAL VENUE TO BE ANNOUNCED]',
    city: '[METROPOLIS / CYBER CONVENTION CENTER]',
    address: '[LOCATION PENDING ANNOUNCEMENT]',
    isConfirmed: false,
    mapPlaceholderUrl: '#',
  },
  organizer: {
    name: 'Dev Summit Organizing Committee',
    community: 'Google Developer Groups (GDG)',
    contactEmail: 'organizers@devsummit-placeholder.gdg',
    socials: [
      { platform: 'Twitter / X', url: 'https://twitter.com/[ORGANIZER_HANDLE]', isConfigured: false },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/[ORGANIZER_PAGE]', isConfigured: false },
      { platform: 'GitHub', url: 'https://github.com/[ORGANIZER_ORG]', isConfigured: false },
      { platform: 'YouTube', url: 'https://youtube.com/@[ORGANIZER_CHANNEL]', isConfigured: false },
    ],
  },
};

export const ABOUT_CONTENT = {
  sectionTitle: 'ABOUT DEV SUMMIT',
  sectionSubtitle: 'TRANSFORMING CODE INTO MONUMENTAL REALITY',
  vision: `Dev Summit is the annual flagship developer conference celebrating innovation, collaboration, and engineering excellence. Inspired by the legendary Transformers ethos of adaptation and evolution, this edition brings together engineers, architects, founders, and creators to transform raw concepts into scalable, world-changing technology.`,
  corePillars: [
    {
      title: 'ADAPTIVE ARCHITECTURE',
      description: 'Master autonomous agent swarms, cloud resilience, and dynamic systems engineered to reconfigure at millisecond scale.',
      code: 'SYS_EVOLVE_01',
    },
    {
      title: 'INTELLIGENT MATRIX',
      description: 'Harness multimodal generative models, on-device neural accelerators, and real-time inference pipelines.',
      code: 'SYS_MATRIX_02',
    },
    {
      title: 'OPEN ECOSYSTEM',
      description: 'Collaborate with the global open-source vanguard, sharing blueprints, benchmarks, and production lessons.',
      code: 'SYS_ALLIANCE_03',
    },
  ],
  stats: [
    { value: '240', label: 'Transform Frames', subtitle: '60 FPS Canvas Engine' },
    { value: '4+', label: 'Deep Tech Tracks', subtitle: 'Curated for Builders' },
    { value: '1,500+', label: 'Expected Builders', subtitle: 'Calling All Autobots' },
    { value: '100%', label: 'Community Driven', subtitle: 'GDG Worldwide' },
  ],
};

export const TRACKS_CONTENT: TrackItem[] = [
  {
    id: 'ai-matrix',
    code: 'TRK-01',
    title: 'NEURAL AUTOBOTS & AGENTS',
    subtitle: 'Autonomous Systems & Generative Intelligence',
    description: 'Explore the vanguard of AI agents, multimodal foundational models, self-optimizing pipelines, and on-device neural acceleration.',
    iconName: 'Sparkles',
    highlights: ['Agentic Workflows & Multi-agent Orchestration', 'Gemini & On-Device ML Deployment', 'Vector Stores & High-Speed Retrieval'],
  },
  {
    id: 'cloud-core',
    code: 'TRK-02',
    title: 'ENERGON CLOUD & SCALE',
    subtitle: 'High-Throughput Infrastructure & Resilient Systems',
    description: 'Discover how hyperscale infrastructure reconfigures dynamically under massive loads, from serverless paradigms to Kubernetes clusters.',
    iconName: 'Cloud',
    highlights: ['Global Multi-Region Distributed Systems', 'Zero-Downtime Migration Architecture', 'Serverless & Edge Compute Optimization'],
  },
  {
    id: 'web-mobile',
    code: 'TRK-03',
    title: 'CYBER INTERFACES & WEB',
    subtitle: 'Next-Generation Client Frameworks & Fluid UX',
    description: 'Transform user interfaces into cinematic, ultra-responsive digital workspaces with WebGL, WebGPU, React 19, and modern web standards.',
    iconName: 'Cpu',
    highlights: ['Next-Gen Web Performance & Canvas Rendering', 'Cross-Platform React & Native Ecosystems', 'Spatial Computing & Progressive Web Apps'],
  },
  {
    id: 'security-quantum',
    code: 'TRK-04',
    title: 'TITAN SECURITY & QUANTUM',
    subtitle: 'Zero Trust Hardening & Future Protocols',
    description: 'Fortify digital supply chains, explore post-quantum cryptographic defenses, and implement privacy-first zero-trust architectures.',
    iconName: 'Shield',
    highlights: ['Software Supply Chain Hardening', 'Zero Trust IAM & Ephemeral Credentials', 'Post-Quantum Encryption Readiness'],
  },
];

export const SCHEDULE_CONTENT: ScheduleItem[] = [
  {
    id: 'sch-01',
    time: '09:00 - 10:00',
    trackId: 'all',
    trackLabel: 'ALL TRACKS',
    title: 'Opening Ceremony & Matrix Keynote: The Transformational Era',
    speakerName: '[KEYNOTE SPEAKER TO BE ANNOUNCED]',
    speakerRole: 'VP of Technology & Architecture',
    speakerCompany: '[TOP TECH LABS]',
    type: 'Keynote',
    location: 'Main Cybertron Auditorium',
    isConfirmed: false,
  },
  {
    id: 'sch-02',
    time: '10:15 - 11:00',
    trackId: 'ai-matrix',
    trackLabel: 'AI MATRIX',
    title: 'Autonomous Swarms: Architecting Collaborative Multi-Agent Systems',
    speakerName: '[SPEAKER PENDING SELECTION]',
    speakerRole: 'Principal AI Scientist',
    speakerCompany: '[AI RESEARCH COLLECTIVE]',
    type: 'Breakout',
    location: 'Auditorium Alpha',
    isConfirmed: false,
  },
  {
    id: 'sch-03',
    time: '11:15 - 12:00',
    trackId: 'cloud-core',
    trackLabel: 'CLOUD CORE',
    title: 'Energon Grid Resilience: Running 10M QPS with Zero Packet Loss',
    speakerName: '[SPEAKER PENDING SELECTION]',
    speakerRole: 'Staff Infrastructure Architect',
    speakerCompany: '[GLOBAL CLOUD SYSTEMS]',
    type: 'Breakout',
    location: 'Auditorium Beta',
    isConfirmed: false,
  },
  {
    id: 'sch-04',
    time: '13:00 - 14:30',
    trackId: 'web-mobile',
    trackLabel: 'WEB & CLIENT',
    title: 'Hands-on Lab: Real-Time 60 FPS Canvas & WebGL Performance Mastery',
    speakerName: '[WORKSHOP LEAD PENDING ANNOUNCEMENT]',
    speakerRole: 'Graphics Engine Developer',
    speakerCompany: '[INTERACTIVE GRAPHICS LAB]',
    type: 'Workshop',
    location: 'Lab Matrix Delta',
    isConfirmed: false,
  },
  {
    id: 'sch-05',
    time: '15:00 - 16:00',
    trackId: 'security-quantum',
    trackLabel: 'TITAN SECURITY',
    title: 'Shielding the Matrix: Post-Quantum Cryptography in Practice',
    speakerName: '[SPEAKER PENDING SELECTION]',
    speakerRole: 'Chief Security Officer',
    speakerCompany: '[DEFENSE APPLIED CRYPTO]',
    type: 'Breakout',
    location: 'Auditorium Alpha',
    isConfirmed: false,
  },
  {
    id: 'sch-06',
    time: '16:30 - 17:30',
    trackId: 'all',
    trackLabel: 'ALL TRACKS',
    title: 'Autobot Founders Panel: Building The Next Century of Technology',
    speakerName: '[FEATURED INDUSTRY PANELISTS]',
    speakerRole: 'Founders & Engineering Leaders',
    speakerCompany: '[GDG & TECH PARTNERS]',
    type: 'Panel',
    location: 'Main Cybertron Auditorium',
    isConfirmed: false,
  },
];

export const SPEAKERS_CONTENT: SpeakerItem[] = [
  {
    id: 'spk-01',
    name: '[SPEAKER SPOTLIGHT #01]',
    title: 'VP of AI Systems',
    company: '[LEADING AI CONSORTIUM]',
    bio: 'Specializing in planetary-scale agent orchestration and neural models. Full announcement scheduled upon roster release.',
    specialty: 'Autonomous Systems & LLMs',
    isConfirmed: false,
    avatarPlaceholder: 'SPK-01',
    socials: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    id: 'spk-02',
    name: '[SPEAKER SPOTLIGHT #02]',
    title: 'Distinguished Cloud Engineer',
    company: '[HYPERSCALE INFRASTRUCTURE]',
    bio: 'Author of open-source distributed primitives and resilient mesh topologies with two decades of production war stories.',
    specialty: 'Distributed Infrastructure',
    isConfirmed: false,
    avatarPlaceholder: 'SPK-02',
    socials: { github: '#', linkedin: '#' },
  },
  {
    id: 'spk-03',
    name: '[SPEAKER SPOTLIGHT #03]',
    title: 'Director of Graphics & Web Engine',
    company: '[CREATIVE TECH FOUNDRY]',
    bio: 'Pioneering GPU-accelerated client experiences, WebGPU shaders, and micro-interaction fluidity on modern browsers.',
    specialty: 'High-Performance Web & GPU',
    isConfirmed: false,
    avatarPlaceholder: 'SPK-03',
    socials: { twitter: '#', github: '#' },
  },
  {
    id: 'spk-04',
    name: '[SPEAKER SPOTLIGHT #04]',
    title: 'Principal Security Researcher',
    company: '[CYBER ZERO TRUST ALLIANCE]',
    bio: 'Specializing in post-quantum key encapsulation, firmware attestation, and hardened container runtimes.',
    specialty: 'Quantum-Safe Cryptography',
    isConfirmed: false,
    avatarPlaceholder: 'SPK-04',
    socials: { linkedin: '#' },
  },
];

export const SPONSORS_CONTENT: SponsorTier[] = [
  {
    id: 'tier-energon',
    tierName: 'ENERGON PRIME TIER',
    description: 'Premier visionaries fueling the Dev Summit transformation journey',
    badgeColor: 'cyan',
    sponsors: [
      { id: 'sp-01', name: '[ENERGON PRIME SPONSOR #1]', isConfirmed: false, logoPlaceholder: 'ENERGON 01', websiteUrl: '#' },
      { id: 'sp-02', name: '[ENERGON PRIME SPONSOR #2]', isConfirmed: false, logoPlaceholder: 'ENERGON 02', websiteUrl: '#' },
    ],
  },
  {
    id: 'tier-matrix',
    tierName: 'MATRIX CORE SUPPORTERS',
    description: 'Empowering workshops, labs, and hands-on developer experiences',
    badgeColor: 'orange',
    sponsors: [
      { id: 'sp-03', name: '[MATRIX SPONSOR #3]', isConfirmed: false, logoPlaceholder: 'MATRIX 03', websiteUrl: '#' },
      { id: 'sp-04', name: '[MATRIX SPONSOR #4]', isConfirmed: false, logoPlaceholder: 'MATRIX 04', websiteUrl: '#' },
      { id: 'sp-05', name: '[MATRIX SPONSOR #5]', isConfirmed: false, logoPlaceholder: 'MATRIX 05', websiteUrl: '#' },
    ],
  },
  {
    id: 'tier-cybertron',
    tierName: 'CYBERTRON COMMUNITY ALLIES',
    description: 'Grassroots communities, open source organizations, and ecosystem accelerators',
    badgeColor: 'slate',
    sponsors: [
      { id: 'sp-06', name: '[COMMUNITY ALLY #1]', isConfirmed: false, logoPlaceholder: 'ALLY 01', websiteUrl: '#' },
      { id: 'sp-07', name: '[COMMUNITY ALLY #2]', isConfirmed: false, logoPlaceholder: 'ALLY 02', websiteUrl: '#' },
      { id: 'sp-08', name: '[COMMUNITY ALLY #3]', isConfirmed: false, logoPlaceholder: 'ALLY 03', websiteUrl: '#' },
      { id: 'sp-09', name: '[COMMUNITY ALLY #4]', isConfirmed: false, logoPlaceholder: 'ALLY 04', websiteUrl: '#' },
    ],
  },
];

export const REGISTRATION_CONFIG: RegistrationConfig = {
  isRegistrationLive: false,
  comingSoonText: 'DEV SUMMIT COMING SOON',
  registrationDestinationUrl: null, // Keep configurable. If null, displays VIP Waitlist / Coming Soon modal
  earlyAccessFormTitle: 'JOIN THE AUTOBOT VANGUARD',
  earlyAccessFormSubtitle: 'Be first in line when ticket batches unlock. Receive exclusive transformation pass notifications and speaker drops.',
  tickets: [
    {
      id: 'tkt-student',
      tier: 'ACADEMY RECRUIT',
      priceDisplay: '[TBD — EARLY BIRD]',
      features: [
        'Full 2-Day Conference Pass',
        'Access to Academy Workshops & Labs',
        'Official Dev Summit Cyber Swag Pack',
        'Discord & Networking Portal Access',
      ],
      status: 'Coming Soon',
    },
    {
      id: 'tkt-general',
      tier: 'AUTOBOT GENERAL',
      priceDisplay: '[TBD — STANDARD]',
      features: [
        'All Keynotes, Breakouts & Technical Tracks',
        'Exclusive Interactive Workshop Access',
        'Energon Buffet & Networking Receptions',
        'Commemorative Transformers Badge & Merch',
        'Post-Event HD Session Archives',
      ],
      status: 'Waitlist Open',
      recommended: true,
    },
    {
      id: 'tkt-matrix-vip',
      tier: 'MATRIX TITAN VIP',
      priceDisplay: '[TBD — VIP TIER]',
      features: [
        'Front-Row Reserved Keynote Seating',
        'VIP Founders & Speakers Dinner Invitation',
        'Private Lounge Access with Dedicated Power & WiFi',
        '1-on-1 Mentorship & Arch Review Sessions',
        'Limited-Edition Collector Energon Artifact',
      ],
      status: 'Coming Soon',
    },
  ],
};

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Register', href: '#register', isCta: true },
];

export const ASSET_PATHS = {
  // EXACT REQUIRED FILE PATHS:
  heroPoster: '/assets/hero-poster.png',
  transformersLoaderLogo: '/assets/transformers-loader-logo.jpg',
  frameTemplate: (index: number) => `/assets/transform-frames/frame-${String(index).padStart(3, '0')}.jpg`,
  totalFrames: 240,
};
