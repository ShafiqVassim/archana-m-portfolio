// All page content lives here. Edit this file, not the components.

export const site = {
  name: 'Archana M',
  fullName: 'Archana Manikandan',
  role: 'Accountant',
  location: 'Coimbatore, Tamil Nadu',
  email: 'archanamanikandan24@gmail.com',
  linkedin: 'https://www.linkedin.com/in/archana-manikandan-39b76816a/',
  resume: '/archana-m-resume.pdf',
  // TODO: replace with the exact track link (Spotify → Share → Copy song link).
  spotify: 'https://open.spotify.com/search/Veesum%20Velichathile',
  // Paste the ID from the song link (open.spotify.com/track/<THIS PART>) to play the song on the page itself.
  spotifyTrackId: '',
  // Optional: a short preview clip you have the rights to, placed in /public (e.g. '/audio/preview.mp3').
  // When set, tapping the record plays it for songPreviewSeconds, then points to Spotify for the rest.
  songPreview: '',
  songPreviewSeconds: 12,
  song: { title: 'Veesum Velichathile', film: 'Naan Ee', year: 2012, language: 'Tamil' },
  // Set to false once real photos replace the illustrations.
  showPlaceholderTags: false,
  // Drop a photo in /public (e.g. '/archana.jpg') and set it here; the hero card then shows the photo.
  portrait: '',
  description:
    'Archana Manikandan, accountant in Coimbatore with 3+ years in billing, cash handling, ledgers and payroll support. Tally-fluent, GST-literate. Also crochets sunflowers.',
};

export const nav = [
  { id: 'ledger', label: 'Ledger', index: 'Statement of account' },
  { id: 'assets', label: 'Assets', index: 'Assets' },
  { id: 'off-the-books', label: 'Off the books', index: 'Off the books' },
  { id: 'documents', label: 'Documents', index: 'Supporting documents' },
  { id: 'contact', label: 'Contact', index: 'Closing balance' },
];

export const experience = [
  {
    dates: ['Jul 2025', 'Present'],
    company: 'RVS Land Surveyors',
    role: 'Accountant',
    entries: [
      'Billing and invoicing for surveying services',
      'Cash collections, receipts and daily transactions',
      'Business expenses, payments and outstanding amounts',
      'Monthly salary and staff payment records',
    ],
    balance: 'Current a/c',
    note: 'still balancing',
    current: true,
  },
  {
    dates: ['Feb 2023', 'Jan 2025'],
    company: 'Maruthi Financial Services',
    role: 'Accounting & Data Entry',
    entries: ['Accounting and data entry across financial records', 'Supported day-to-day financial operations'],
    balance: 'Carried fwd',
    note: '2 years, all accounted for',
  },
  {
    dates: ['Sep 2022', 'Jan 2023'],
    company: 'Sai Techno Solutions',
    role: 'Sales Associate',
    entries: ['Sales activities and customer interactions', 'Day-to-day operational support'],
    balance: 'Opening entry',
    note: 'where it all began',
  },
];

export const assets = [
  { code: 'A-01', name: 'Tally', desc: 'Fluent. Has opinions about keyboard shortcuts.' },
  { code: 'A-02', name: 'Accounts payable & receivable', desc: 'Who owes whom, and when. Chased politely.' },
  { code: 'A-03', name: 'Billing & invoicing', desc: 'Invoices that go out on time and add up.' },
  { code: 'A-04', name: 'Ledger maintenance', desc: 'Every entry has a home and a reason.' },
  { code: 'A-05', name: 'Salary & payroll support', desc: 'Monthly salary records, paperwork included.' },
  { code: 'A-06', name: 'Income tax filing support', desc: 'Supporting documents, sorted before anyone asks.' },
  { code: 'A-07', name: 'GST & taxation support', desc: 'Fluent in the acronym. Calm about the deadlines.' },
];

export const hobbies = [
  { key: 'crochet', name: 'Handmade flowers', photo: true, pos: '50% 50%', alt: 'Handmade bouquet of orange and yellow sunflowers with lavender sprigs', desc: 'Yes, I made these. They never wilt. Storage is another story.' },
  { key: 'drawing', name: 'Drawing', photo: true, pos: '50% 45%', alt: 'Coloured-pencil drawing of a sleeping white bunny curled up on autumn leaves', desc: 'Yes, I drew this. The bunny sat still. Ledgers rarely do.' },
  { key: 'music', name: 'Music', photo: true, pos: '50% 50%', alt: 'Black-and-white cat wearing white headphones by the sea', desc: 'On loop: Veesum Velichathile, Naan Ee. Yes, the housefly film.' },
  { key: 'mehndi', name: 'Mehndi (a little)', photo: true, pos: '50% 42%', alt: 'Floral mehndi design on the palm of a hand', desc: 'Yes, that’s my mehndi. Steady hands, clean lines, like my ledgers.' },
  { key: 'rangoli', name: 'Rangoli', photo: true, pos: '50% 50%', alt: 'Circular flower-petal rangoli with a pinwheel centre in maroon, white, yellow, orange and purple', desc: 'Yes, I made this. Every petal accounted for.' },
];

export const education = [
  { when: '2020 – 2022', title: 'M.A. Economics', where: 'Bharathiar University' },
  { when: '2018 – 2020', title: 'B.A. Economics', where: 'PSGR Krishnammal College for Women' },
];

export const certifications = [
  { when: 'DCA', title: 'Diploma in Computer Application', where: 'Tally' },
  { when: 'Course', title: 'Job Oriented Course', where: 'Retail Banking' },
  { when: 'Online', title: 'Soft Skill Training', where: 'Infosys' },
];

export const languages = ['English', 'Tamil'];
