"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "Browse Courses", href: "#courses" },
    { name: "Mentorship Program", href: "#mentors" },
    { name: "Pricing Plans", href: "#pricing" },
    { name: "Learning Paths", href: "#paths" },
  ],
  Company: [
    { name: "About Us", href: "#about" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
    { name: "Blog & News", href: "#blog" },
  ],
  Resources: [
    { name: "Help Center", href: "#help" },
    { name: "Community Forum", href: "#forum" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
  ],
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const contactInfo = [
  { icon: MapPin, text: "123 Knowledge Street, Heritage District" },
  { icon: Phone, text: "+1 (555) 123-4567" },
  { icon: Mail, text: "contact@salahuddinlearning.com" },
  { icon: Clock, text: "Mon-Fri: 9AM-6PM" },
];

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const socialIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "backOut" },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 },
    },
  };

  const contactItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-black border-t border-white/10">
      {/* Main Footer */}
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-12"
        >
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Brand Column */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="mb-6">
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-gold">
                    <BookOpen className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Salahuddin Heritage
                    </h2>
                    <p className="text-sm text-gold">
                      Timeless Wisdom, Modern Skills
                    </p>
                  </div>
                </Link>
              </div>

              <p className="mb-6 text-neutral-400">
                Empowering individuals through knowledge that connects the past
                with the future.
              </p>

              {/* Social Links */}
              <div className="mb-8">
                <h4 className="mb-4 text-sm font-semibold text-neutral-300">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        variants={socialIconVariants}
                        custom={index}
                        whileHover="hover"
                        href={social.href}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
                        aria-label={social.label}
                      >
                        <Icon size={18} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(
              ([category, links], columnIndex) => (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  custom={columnIndex}
                  transition={{ delay: columnIndex * 0.1 }}
                >
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                      <motion.li
                        key={link.name}
                        variants={linkVariants}
                        custom={linkIndex}
                        transition={{
                          delay: columnIndex * 0.1 + linkIndex * 0.05,
                        }}
                      >
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-neutral-400 transition-colors hover:text-gold"
                        >
                          <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                          <span>{link.name}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )
            )}

            {/* Contact Column */}
            <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Contact Info
              </h3>
              <ul className="space-y-3">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.li
                      key={index}
                      variants={contactItemVariants}
                      custom={index}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Icon className="mt-0.5 h-4 w-4 text-gold" />
                      <span className="text-sm text-neutral-400">
                        {info.text}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-y border-white/10 py-8"
        >
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
              <p className="text-sm text-neutral-400">
                Get the latest courses and insights
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <motion.input
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                type="email"
                placeholder="Your email address"
                className="input flex-1"
              />
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                type="submit"
                className="btn btn-primary"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-6"
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-neutral-500">
                © 2023 Salahuddin Heritage Learning. All rights reserved.
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                Empowering individuals through knowledge that connects the past
                with the future.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { href: "#privacy", text: "Privacy Policy" },
                { href: "#terms", text: "Terms of Service" },
                { href: "#support", text: "Support" },
                { href: "#sitemap", text: "Sitemap" },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-gold"
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
    </footer>
  );
}
