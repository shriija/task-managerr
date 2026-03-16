import React from 'react'
import { NavLink } from 'react-router'


function Home() {
  return (
    <div className="bg-white overflow-hidden">

  {/* HERO */}
  <section className="pt-20 pb-20">
    <div className="max-w-7xl mx-auto px-4 text-center mt-8">

      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
        Organize Your Work<br />
        <span className="text-blue-600">Simplify Your Life</span>
      </h1>

      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Plan tasks, Track progress, and collaborate with your team in one powerful workspace
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <NavLink to="/register" className="group relative w-40 flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Get Started 
        </NavLink>
      </div>

    </div>
  </section>


  {/* FEATURES */}
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Features
        </h2>
        <h3>Everything You Need to Stay Productive</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Visual Task Boards</h3>
          <p className="text-gray-600">
            Organize tasks using simple boards, lists, and cards to clearly see what needs to be done.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Drag & Drop Workflow</h3>
          <p className="text-gray-600">
            Move tasks between lists effortlessly with an intuitive drag-and-drop interface.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
          <p className="text-gray-600">
           Invite teammates, assign tasks, and work together in real time on shared projects.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">File Attachments</h3>
          <p className="text-gray-600">
           Attach documents, images, and resources directly to tasks for quick access.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Activity Tracking</h3>
          <p className="text-gray-600">
           Keep track of updates and see who changed what with detailed activity logs.
          </p>
        </div>

        <div className="p-8 bg-white border rounded-xl">
          <h3 className="text-xl font-bold mb-3">Task Priorities & Deadlines</h3>
          <p className="text-gray-600">
           Set priorities and due dates to keep your work organized and on schedule.
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
          Kanvas
        </h2>

        <p className="text-gray-300 text-lg">
          Simple task management for teams and individuals
        </p>
      </div>

      <div className="flex-1">
        <img
          src="../assets/react.svg"
          alt="Kanvas Final Screenshot"
          className="rounded-lg shadow-lg"
        />
      </div>

    </div>
  </section>

</div>
  )
}

export default Home