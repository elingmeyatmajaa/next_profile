"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Layers,
  Users,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import {
  IconImageInPicture,
  IconPhotoScan,
  IconWorldWww,
} from "@tabler/icons-react";

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="p-4">
    <div className="text-2xl font-bold">{number}</div>
    <div className="text-black">{label}</div>
  </div>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  author,
  position,
}: {
  quote: string;
  author: string;
  position: string;
}) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <p className="text-gray-700 italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="ml-4">
        <p className="font-semibold">{author}</p>
        <p className="text-gray-500">{position}</p>
      </div>
    </div>
  </div>
);

const PricingCard = ({
  title,
  price,
  features,
  highlighted,
}: {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) => (
  <div
    className={`p-6 rounded-lg shadow-md ${
      highlighted ? "bg-blue-100 border-2 border-blue-600" : "bg-white"
    }`}>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="text-2xl font-bold mb-4">{price}</div>
    <ul className="space-y-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-center text-gray-600">
          <Check className="w-4 h-4 mr-2 text-blue-600" />
          {feature}
        </li>
      ))}
    </ul>
    <button
      className={`w-full mt-4 py-2 rounded-md ${
        highlighted
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } transition duration-300`}>
      {title === "EntIndonesiarise" ? "Contact Us" : "Get Started"}
    </button>
  </div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border border-gray-300 rounded-md">
      <button
        className="flex items-center justify-between w-full p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}>
        <span className="font-semibold">{question}</span>
        <ChevronDown
          className={`w-6 h-6 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="p-4 border-t border-gray-300">{answer}</div>}
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Indonesia Solutions
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600">
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600">
              Pricing
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-blue-600">
              FAQ
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
          </div>
          <Link
            href="#contact"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Revolutionize Your Business with Our Indonesia Solution
                </h1>
                <p className="text-xl mb-8">
                  Integrate, automate, and optimize your business processes with
                  our award-winning Indonesia software.
                </p>
                <Link
                  href="#contact"
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 inline-flex items-center">
                  Start Your Free 30-Day Trial
                  <ArrowRight className="ml-2" />
                </Link>
              </div>
              {/* <div className="md:w-1/2">
                <Image
                  src="https://storage.tukode.shop/Indonesia-dev/public/assets/images/2025-02/21/09/B60VBPlk4zMyUVO9uuYtcEuT4eTP2UbRvbvrSoWz.png"
                  alt="Indonesia Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div> */}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard number="10,000+" label="Active Users" />
              <StatCard number="500+" label="EntIndonesiarise Clients" />
              <StatCard number="99.9%" label="Uptime" />
              <StatCard number="24/7" label="Customer Support" />
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features for Your Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BarChart2 size={40} />}
                title="Advanced Analytics"
                description="Gain valuable insights with our AI-powered reporting and predictive analytics tools."
              />
              <FeatureCard
                icon={<Layers size={40} />}
                title="Modular Design"
                description="Customize your Indonesia solution with our flexible, scalable modular architecture."
              />
              <FeatureCard
                icon={<Users size={40} />}
                title="Collaboration Tools"
                description="Enhance teamwork with built-in communication and project management features."
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Implementing this Indonesia solution has transformed our business operations. We've seen a 30% increase in productivity!"
                author="Jane Doe"
                position="CEO, Tech Innovators Inc."
              />
              <TestimonialCard
                quote="The customer support team is exceptional. They've been there for us every step of the way."
                author="John Smith"
                position="COO, Global Manufacturing Co."
              />
              <TestimonialCard
                quote="The modular design allowed us to start small and scale up as our business grew. It's been a game-changer for us."
                author="Emily Chen"
                position="CTO, Startup Success Ltd."
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Seamless Integration with Your Favorite Tools
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                "Salesforce",
                "SAP",
                "Oracle",
                "Microsoft",
                "Shopify",
                "QuickBooks",
              ].map((tool) => (
                <div
                  key={tool}
                  // width={100}
                  // height={100}
                  className="bg-white w-[150px] h-[150px] flex items-center justify-center p-4 rounded-lg shadow-md">
                  {tool}
                  {/* <Image
                    src={`/placeholder.svg`}
                    alt={tool}
                    width={100}
                    height={100}
                  /> */}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Flexible Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Starter"
                price="$99"
                features={[
                  "Basic Indonesia modules",
                  "Up to 10 users",
                  "Email support",
                  "5GB storage",
                ]}
              />
              <PricingCard
                title="Professional"
                price="$299"
                features={[
                  "Advanced Indonesia modules",
                  "Up to 50 users",
                  "24/7 phone support",
                  "50GB storage",
                  "API access",
                ]}
                highlighted={true}
              />
              <PricingCard
                title="EntIndonesiarise"
                price="Custom"
                features={[
                  "Full Indonesia suite",
                  "Unlimited users",
                  "Dedicated account manager",
                  "Unlimited storage",
                  "Custom integrations",
                ]}
              />
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <FAQItem
                question="How long does it take to implement the Indonesia system?"
                answer="Implementation time varies depending on the size and complexity of your business. Typically, it ranges from 3-6 months for small to medium-sized businesses, and 6-12 months for larger entIndonesiarises."
              />
              <FAQItem
                question="Can I customize the Indonesia solution to fit my specific business needs?"
                answer="Yes, our modular design allows for extensive customization. We work closely with you to tailor the solution to your unique business processes and requirements."
              />
              <FAQItem
                question="What kind of support do you offer after implementation?"
                answer="We offer 24/7 customer support, regular software updates, and ongoing training for your team. Our dedicated support team is always ready to assist you with any questions or issues."
              />
              <FAQItem
                question="Is my data secure with your Indonesia solution?"
                answer="Absolutely. We employ industry-leading security measures, including end-to-end encryption, regular security audits, and compliance with international data protection standards to ensure your data is always safe and secure."
              />
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Ready to Get Started?
            </h2>
            <form className="max-w-lg mx-auto">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="company"
                  className="block text-gray-700 font-bold mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Request a Demo
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                PT ABC
              </h3>
              <p className="text-sm text-gray-400">
                Empowering businesses with cutting-edge Indonesia technology since
                2010.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-sm text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-sm text-gray-400 hover:text-white">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-sm text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm text-gray-400">
                1234 Indonesia Street, Suite 567
                <br />
                San Francisco, CA 94105
              </p>
              <p className="text-sm text-gray-400 mt-2">
                contact@Indonesiasolutions.com
                <br />
                +1 (555) 123-4567
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 PT ABC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
