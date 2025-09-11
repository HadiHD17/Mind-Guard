import "./footer.css";
import { FaXTwitter, FaGithub, FaPinterest } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          Mind<span className="light">Guard</span>
        </div>
        <p className="footer__tag">Your AI companion for mental wellness</p>

        <div className="footer__links">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)">
            <FaXTwitter />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub">
            <FaGithub />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest">
            <FaPinterest />
          </a>
        </div>

        <div className="footer__copy">
          © 2025 MindGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
