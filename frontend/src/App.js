import logo from './ddd.svg';
import './App.css';
import Chart from './components/Chart';

function App() {
  return (
    <div className="App">
      <img src={logo} />
      Due Diligence for Dummies!
      <Chart/>
    </div>
  );
}

export default App;
