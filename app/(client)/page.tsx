import About from './hero/about';
import Contact from './hero/contact';
import Landing from './hero/landing';
import Results from './hero/results';
import Services from './hero/services';

export default function HomePage() {
  return (
    <div>
      <Landing />
      <Results />
      <Services />
      <About />
      <Contact />
    </div>
  );
}