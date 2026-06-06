import React from 'react';
import { motion } from 'framer-motion';
import { FaTshirt, FaGem, FaLeaf, FaGlobe } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">About FashionHub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to make fashion accessible, sustainable, and enjoyable for everyone.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2020, FashionHub started with a simple idea: create a clothing brand that combines 
            style, comfort, and sustainability. What began as a small online store has grown into a 
            community of fashion enthusiasts who believe that looking good shouldn't come at the cost 
            of the planet.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, we're proud to offer a curated collection of clothing that meets the highest standards 
            of quality and ethical production. Every piece in our collection is designed to last, 
            manufactured responsibly, and shipped in eco-friendly packaging.
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className="rounded-lg overflow-hidden shadow-xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600" 
            alt="Our Store"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: FaTshirt, title: "Quality First", desc: "We source only the finest materials" },
            { icon: FaLeaf, title: "Sustainability", desc: "Eco-friendly practices throughout" },
            { icon: FaGem, title: "Timeless Design", desc: "Styles that never go out of fashion" },
            { icon: FaGlobe, title: "Global Community", desc: "Celebrating diversity in fashion" }
          ].map((value, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <value.icon className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
        <p className="mb-6">Be part of a fashion revolution that cares about style AND substance.</p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
          Shop Now
        </button>
      </motion.div>
    </div>
  );
};

export default About;