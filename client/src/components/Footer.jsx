// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-auto theme-transition">
      <div className="container mx-auto px-4 py-5.5">
        <div className="flex flex-col items-center space-y-4">
          {/* Copyright */}
          <p className="text-gray-600 dark:text-gray-400 text-sm theme-transition">
            © 2025 StackNova
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;