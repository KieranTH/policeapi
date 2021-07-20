import logo from './logo.svg';
import './App.css';
import './main.css';

import Data from './Data/Data';
import Form from './Form/Form';

function App() {
  return (
    <main className="container">
      <section className="title">
        <div className="title__title">
          <h1>Police API Demonstration</h1>
        </div>
      </section>
      <section className="api__data">
        <div className="api__container">
          <Form/>
        </div>
      </section>
    </main>
  );
}

export default App;
