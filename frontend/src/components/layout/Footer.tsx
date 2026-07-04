import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

/* ============================================
   FOOTER COMPONENT
   Site footer with links, social icons, copyright
   ============================================ */

const productLinks = [
  { label: 'Home', path: '/' },
  { label: 'Discover', path: '/discover' },
  { label: 'Reports', path: '/reports' },
];

const resourceLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'AI Assistant', path: '/ai-chat' },
];

const legalLinks = [
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
  { label: 'Contact', path: '/contact' },
];

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Flame className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-white">GPF</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Discover, analyse, and track critical problems facing Indian governance
              through comprehensive data from government reports and official sources.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="flex flex-col gap-3 mb-6">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border text-text-muted hover:text-white hover:border-primary hover:bg-white/5 transition-all duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border text-text-muted hover:text-white hover:border-primary hover:bg-white/5 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-text-muted">
            © 2025 Government Problem Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
