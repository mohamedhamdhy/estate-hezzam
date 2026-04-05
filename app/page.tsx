import About from './client/hero/about';
import Contact from './client/hero/contact';
import Landing from './client/hero/landing';
import Results from './client/hero/results';
import Services from './client/hero/services';

const page = () => {
  return (
    <div>
      <Landing />
      <Results />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default page;
