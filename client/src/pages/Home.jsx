import React from 'react'
import { NavLink } from 'react-router'


function Home() {
  return (
    <div className="bg-white overflow-hidden">

  {/* HERO */}
  <section className="pt-20 pb-32">
    <div className="max-w-7xl mx-auto px-4 text-center">

      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
        Reimagine your <br />
        <span className="text-blue-600">Dream Space</span>
      </h1>

      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Transform your room photos into personalized interior designs using AI.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold">
          Get Started
        </button>

        <NavLink
          to="/demo"
          className="px-8 py-4 border border-gray-300 rounded-full font-semibold"
        >
          View Demo
        </NavLink>
      </div>

    </div>
  </section>


  {/* FEATURES */}
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900">
          Features
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">AI Design</h3>
          <p className="text-gray-600">
            Upload a room photo and generate multiple design ideas instantly.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Custom Styles</h3>
          <p className="text-gray-600">
            Choose from modern, minimalist, bohemian and more.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Visualization</h3>
          <p className="text-gray-600">
            See realistic previews of furniture and colors in your room.
          </p>
        </div>

      </div>
    </div>
  </section>


  {/* SHOWCASE */}
  <section className="py-20 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Transform Your Space
        </h2>

        <p className="text-gray-300 text-lg">
          Generate realistic interior design previews instantly.
        </p>
      </div>

      <div className="flex-1">
        <img
          src="../assets/react.svg"
          alt="Room design"
          className="rounded-lg shadow-lg"
        />
      </div>

    </div>
  </section>

</div>
  )
}

export default Home