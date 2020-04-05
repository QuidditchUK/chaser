import React from 'react';
import { usePrismicFetch } from './hooks';
import renderPrismicSections from './containers/prismic';

function App() {
  const [page, loadingPageData] = usePrismicFetch('pages', 'home');

  return (
    <div className="App">
      {loadingPageData
        ? <> Loading...</>
        : <>{renderPrismicSections(page.data.body)}</>}

      <div className="section-one container">
        <h2>Latest News</h2>

        <div className="grid">
          <div className="block">
            <div className="img-container">
              <img src="1.jpg" alt="image one" />
            </div>

            <p>This is the latest news for the quidditch uk ...Read More</p>
          </div>

          <div className="block">
            <div className="img-container">
              <img src="2.jpg" alt="image one" />
            </div>

            <p>This is the latest news for the quidditch uk ...Read More</p>
          </div>

          <div className="block">
            <div className="img-container">
              <img src="3.jpg" alt="image one" />
            </div>

            <p>This is the latest news for the quidditch uk ...Read More</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
