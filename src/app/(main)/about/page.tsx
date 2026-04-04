export default function About() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-primary text-center mb-12">
          About Us
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary-medium mb-6">
              Welcome to UNIK Academy
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              UNIK Academy is a premier educational institution dedicated to
              empowering individuals through effective communication and
              personality development. We believe that strong communication
              skills are the foundation of personal and professional success.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Our mission is to transform personalities by providing
              comprehensive training in communication skills, public speaking,
              English language proficiency, and overall personality development.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary-medium mb-6">
              Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              To become the leading academy for communication skills and
              personality development, empowering individuals to achieve their
              full potential and excel in their personal and professional
              endeavors.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary-medium mb-6">
              Why Choose UNIK Academy?
            </h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">✓</span>
                <span>
                  Expert instructors with years of experience in communication
                  training
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">✓</span>
                <span>
                  Personalized attention through flexible session formats
                  (1-on-1, small groups)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">✓</span>
                <span>
                  Comprehensive curriculum covering all aspects of communication
                  and personality
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">✓</span>
                <span>Practical, hands-on approach to learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3 text-xl">✓</span>
                <span>Affordable pricing options to suit different needs</span>
              </li>
            </ul>
          </section>

          <section className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-primary-medium mb-6">
              Our Core Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Communication Skills
                </h3>
                <p className="text-gray-600">
                  Master the fundamentals of effective communication in personal
                  and professional settings.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Public Speaking & Presentation
                </h3>
                <p className="text-gray-600">
                  Build confidence and excel in public speaking and professional
                  presentations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Spoken English & Grammar
                </h3>
                <p className="text-gray-600">
                  Improve your English fluency, grammar, and overall language
                  proficiency.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Personality Development
                </h3>
                <p className="text-gray-600">
                  Transform your personality and develop essential leadership
                  and interpersonal skills.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-primary-medium mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              Ready to begin your journey with UNIK Academy? Contact us today!
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-medium transition-colors font-semibold"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
