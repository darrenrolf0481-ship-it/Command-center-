const lucide = require('lucide-react');
const icons = [
  'Moon', 'Sun', 'Activity', 'Cpu', 'Database', 'Network', 'Terminal', 'Settings',
  'HardDrive', 'MessageSquare', 'Globe', 'ExternalLink', 'Paperclip', 'Send',
  'Loader2', 'FileText', 'Image'
];
icons.forEach(name => {
  if (!lucide[name]) console.log('MISSING:', name);
});
console.log('Done checking icons.');
