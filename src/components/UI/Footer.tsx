import { motion } from 'framer-motion';
import { Heart, Linkedin, Instagram, Github, Mail } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/rushanhaque?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      color: '#0077B5',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/rushanhaque?igsh=MTN1eTBlMG45andoZw==',
      color: '#E4405F',
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/rushanhaque',
      color: '#181717',
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:rushanulhaque@gmail.com',
      color: '#EA4335',
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 py-8 glass-dark rounded-t-3xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Developer Credit */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-white"
          >
            <span className="text-lg">Developed with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            </motion.div>
            <span className="text-lg">by</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Rushan Haque
            </span>
          </motion.div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 5,
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all group relative"
                  aria-label={link.name}
                >
                  <Icon className="w-5 h-5 text-white" />
                  
                  {/* Tooltip */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                  >
                    {link.name}
                  </motion.span>

                  {/* Animated ring on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      border: `2px solid ${link.color}`,
                      opacity: 0,
                    }}
                    whileHover={{
                      scale: [1, 1.3, 1.5],
                      opacity: [0.5, 0.3, 0],
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-white/40 text-sm"
        >
          <p>B.Tech in Computer Science - Internet of Things | India</p>
          <p className="mt-2">© {new Date().getFullYear()} Ledgerly. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
