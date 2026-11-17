import { useState, StrictMode } from "react";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchPage />
  </StrictMode>,
)

import { parseJSONTextWithBigInt, buildFullURL, getUrlParameters } from '../misc_functions.js';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Searchbar from '../components/Searchbar.jsx';
import AISlowDownLink from '../components/AISlowDownLink.jsx';
import VideoCell from '../components/VideoCell.jsx';

//A search page. 
function SearchPage() {
  let [search_results, setSearchResults] = useState([]);
  let getSearchResults = async (query) => {
    //Make a search in the database and set the search results. 
    let resp = await fetch(buildFullURL("/search?query=" + encodeURIComponent(query)));
    let r_text = await resp.text();
    let r_json = parseJSONTextWithBigInt(r_text);

    setSearchResults(r_json.result);
  };
  //Get the query from the url parameters, if available and perform a search in the database. 
  let urlParams = getUrlParameters();
  if (search_results.length == 0 && urlParams.has("query")) {
    let query = urlParams.get("query");
    if (query) {
      getSearchResults(query);
    }
  }
  //Build the component. 
  return (
    <>
      <Header />
      <AISlowDownLink />
      <Searchbar onSubmitFunction={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        let query = data.input;
        getSearchResults(query);
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
    if (doc_type == 0) {
      resultingComponents.push(<VideoCell key={id} id={id} />);
    }
  }
  return (
    <>
      {
        resultingComponents
      }
    </>
  );
}

export default SearchPage;
