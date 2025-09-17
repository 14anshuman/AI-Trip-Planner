import React from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 md:px-20 py-16 overflow-hidden h-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white -z-10" />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center font-extrabold leading-tight"
      >
        <span className="block text-5xl md:text-7xl bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent">
          Discover Your Next Adventure with AI
        </span>
        <span className="block text-4xl md:text-6xl text-gray-900 mt-3">
          Personalized Itineraries at Your Fingertips
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-6 text-lg md:text-xl text-gray-600 text-center max-w-2xl"
      >
        Your personal trip planner and travel curator, creating custom itineraries
        tailored to your interests and budget.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8"
      >
        <Link to="/create-trip">
          <Button className="h-14 px-8 text-lg rounded-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all">
            🚀 Get Started
          </Button>
        </Link>
      </motion.div>

      {/* Mockup Image */}
      <motion.img
        src="/mockup.png"
        alt="Travel App Mockup"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.9 }}
        className="mt-6 w-full max-w-5xl ml-12"
      />
      
    </section>
  )
}

export default Hero
