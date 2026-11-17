import { useState } from "react";
import { script } from "react-dom";

import { parseJSONTextWithBigInt } from './misc_functions.js';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Searchbar from './components/Searchbar.jsx';
import AISlowDownLink from './components/AISlowDownLink.jsx';
import VideoCell from './components/VideoCell.jsx';

import './App.css';

function App() {
  let [search_results, setSearchResults] = useState([]);
  return (
    <>
      <Header />
      <AISlowDownLink />
      <Searchbar onSubmitFunction={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        //console.log("Form data: ", data);
        let query = data.input;
        let resp = await fetch("http://127.0.0.1:5999/search?query=" + query);

        // let r_json = await resp.json();
        let r_text = await resp.text();
        let r_json = parseJSONTextWithBigInt(r_text);

        // let search_results = r_json.result;
        setSearchResults(r_json.result);
      }}/>
      <SearchResultsComponent search_results={search_results}/>
      <Footer />
    </>
  );
}

function SearchResultsComponent({ search_results }) {
  console.log(search_results);
  let resultingComponents = [];
  for (let search_result of search_results) {
    let doc_type = search_result.doc_type;
    let id = search_result.id;
    // console.log("doc_type: " + doc_type.toString() + ", id: " + id.toString());
    if (doc_type == 0) {
      resultingComponents.push(<VideoCell key={id} id={id} />);
    }
  }
  {/* let testDynComponent = <> */}
  {/*   <p>I'm a component!</p> */}
  {/* </>; */}
  {/* resultingComponents.push(testDynComponent); */}
  {/* resultingComponents.push(testDynComponent); */}
  {/* resultingComponents.push(testDynComponent); */}
  return (
    <>
      {
        resultingComponents
      }
    </>
  );
}

/*
 *async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        //console.log("Form data: ", data);
        let query = data.input;
        //TODO: Send form data to server, parse results, and display them. 
        let resp = await fetch("http://127.0.0.1:5999/search?query=" + query);
        let r_json = await resp.json();
        let search_results = r_json.result;
        console.log(search_results);
        for (search_result in search_results) {
        }
      }
*/

export default App
