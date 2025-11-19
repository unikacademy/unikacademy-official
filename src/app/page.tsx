import Link from "next/link";

export default function Home() {
  const courses = [
    {
      title: "Communication Skills",
      description: "Master the art of effective communication",
    },
    {
      title: "ABI",
      description: "Advanced Business Intelligence and communication",
    },
    {
      title: "Public Speaking & Presentation Skills",
      description: "Build confidence and excel in public speaking",
    },
    {
      title: "Spoken English & Grammar",
      description: "Improve your English fluency and grammar",
    },
    {
      title: "Personality Development",
      description: "Transform your personality and leadership skills",
    },
  ];

  const pricingPlans = [
    {
      type: "1-on-1 Sessions",
      price: "12,000",
      description: "Personalized one-on-one coaching sessions",
    },
    {
      type: "1-to-2 Sessions",
      price: "9,000",
      description: "Small group sessions with maximum attention",
    },
    {
      type: "1-to-5 Group Sessions",
      price: "6,000",
      description: "Interactive group learning experience",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary to-primary-medium text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">UNIK Academy</h1>
          <p className="text-xl md:text-2xl mb-2 text-accent font-semibold">
            Empowering Communication.
          </p>
          <p className="text-xl md:text-2xl text-accent font-semibold">
            Transforming Personalities.
          </p>
        </div>
      </section>

      {/* Course Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Course Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-accent hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {plan.type}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">
                    ₹{plan.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <Link
                  href="/contact"
                  className="block w-full text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-medium transition-colors"
                >
                  Enroll Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Our Core Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-accent hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Communication Skills?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join UNIK Academy today and take the first step towards personal and
            professional excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-accent text-primary font-bold px-8 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
