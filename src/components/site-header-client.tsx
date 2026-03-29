"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { EditableLink } from "@/lib/site-config";

type SiteHeaderClientProps = {
  brandName: string;
  brandSince: string;
  navLinks: EditableLink[];
  loginLink: EditableLink;
  cta: EditableLink;
};

function isExternal(href: string, forceExternal?: boolean) {
  if (forceExternal) return true;
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function HeaderLink({
  link,
  className,
  onClick,
  children,
}: {
  link: EditableLink;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (isExternal(link.href, link.external)) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function SiteHeaderClient({
  brandName,
  brandSince,
  navLinks,
  loginLink,
  cta,
}: SiteHeaderClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-[var(--color-border)] bg-[rgba(250,250,248,0.95)] shadow-[var(--shadow-md)] backdrop-blur-xl"
          : "border-transparent bg-transparent backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src="/images/visaguru-logo.png"
            alt={brandName}
            width={180}
            height={48}
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] md:h-12"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const activeHref = link.href.split("#")[0];
            const isActive =
              pathname === activeHref ||
              (activeHref !== "/" && pathname.startsWith(activeHref));
            return (
              <HeaderLink
                key={`${link.href}-${link.label}`}
                link={link}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-[var(--color-navy)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-navy)]",
                )}
              >
                {link.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[var(--color-gold)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
              </HeaderLink>
            );
          })}
          <HeaderLink
            link={loginLink}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              pathname === loginLink.href
                ? "text-[var(--color-navy)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-navy)]",
            )}
          >
            {loginLink.label}
          </HeaderLink>
          <HeaderLink
            link={cta}
            className="btn-shimmer rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[var(--shadow-gold)]"
          >
            {cta.label}
          </HeaderLink>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] transition hover:bg-[var(--color-surface)] md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
              {navLinks.map((link) => (
                <HeaderLink
                  key={`${link.href}-${link.label}-mobile`}
                  link={link}
                  className={cn(
                    "text-sm font-medium",
                    pathname === link.href
                      ? "text-[var(--color-gold)]"
                      : "text-[var(--color-muted)]",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </HeaderLink>
              ))}
              <HeaderLink
                link={loginLink}
                className="text-sm font-medium text-[var(--color-muted)]"
                onClick={() => setIsOpen(false)}
              >
                {loginLink.label}
              </HeaderLink>
              <HeaderLink
                link={cta}
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-white"
                onClick={() => setIsOpen(false)}
              >
                {cta.label}
              </HeaderLink>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
