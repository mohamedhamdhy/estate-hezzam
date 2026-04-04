import React from 'react'
import HeroContact from './hero/hero'
import Results from './results/page'
import Properties from './services/page'
import Testimonials from './testimonials/page'

const page = () => {
  return (
    <div>
      <HeroContact />
      <Properties />
      <Results />
      <Testimonials />
    </div>
  )
}

export default page
