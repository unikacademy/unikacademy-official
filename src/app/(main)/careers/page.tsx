'use client';

import { useState, FormEvent } from 'react';

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          position: 'Sales Executive Internship',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            WE&apos;RE HIRING!
          </h1>
          <h2 className="text-3xl font-bold text-accent mb-4">UNIK</h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary-medium mb-2">
              SALES EXECUTIVE
            </h3>
            <p className="text-xl text-gray-600 mb-2">INTERNSHIP</p>
            <p className="text-lg text-accent font-semibold">WORK FROM HOME</p>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold text-primary mb-4">RESPONSIBILITIES</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">•</span>
                <span>Communicate with potential students</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">•</span>
                <span>Explain course details & guide enrollment</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">•</span>
                <span>Follow up via calls & WhatsApp</span>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold text-primary mb-4">ELIGIBILITY</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">•</span>
                <span>Students or freshers</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">•</span>
                <span>Good communication skills</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">•</span>
                <span>Confident & eager to learn</span>
              </li>
            </ul>
          </div>

          <div className="bg-accent/10 p-6 rounded-lg text-center mb-8">
            <p className="text-lg font-semibold text-primary mb-2">TO APPLY</p>
            <a
              href="mailto:unikacademy2025@gmail.com"
              className="text-accent font-bold text-xl hover:underline"
            >
              unikacademy2025@gmail.com
            </a>
          </div>

          <div className="border-t pt-8">
            <h4 className="text-xl font-bold text-primary mb-6 text-center">
              Apply Now
            </h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Your Phone Number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Thank you! Your application has been submitted successfully.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  There was an error submitting your application. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-medium transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

