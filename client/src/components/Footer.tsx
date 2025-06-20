import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Diet Plan Generator
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AI-powered personalized nutrition plans to help you achieve your health and fitness goals.
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for your health
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
              Features
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Personalized meal plans</li>
              <li>• BMI calculation</li>
              <li>• Goal tracking</li>
              <li>• AI-powered recommendations</li>
              <li>• PDF export</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 Diet Plan Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;