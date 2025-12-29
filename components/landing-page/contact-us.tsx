const ContactUs = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join over 50,000 students already learning on our platform. Get
            started today with our free trial.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="rounded-lg bg-white px-8 py-3.5 font-bold text-blue-600 hover:bg-gray-100 transition-colors shadow-lg">
              Get Started Free →
            </button>
            <button className="rounded-lg border-2 border-white bg-transparent px-8 py-3.5 font-bold text-white hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-blue-200">Hours of Content</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-blue-200">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-blue-200">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-blue-200">Learning Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
