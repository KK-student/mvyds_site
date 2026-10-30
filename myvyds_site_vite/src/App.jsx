import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Searchbar from './components/Searchbar.jsx';
import AISlowDownLink from './components/AISlowDownLink.jsx';

import './App.css';

function App() {
  return (
    <>
      <Header />
      <AISlowDownLink />
      <Searchbar />
      <Footer />
    </>
  );
}

export default App
