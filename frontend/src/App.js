import './App.css';
// Theme
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeObj from './util/theme';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
// Router 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Components 
import NavBar from './components/NavBar';
// Pages 
import Home from './pages/Home';

const theme = createMuiTheme(themeObj);

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <NavBar />
          <div className="App">
            <Switch>
              <Route exact path="/" component={Home}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
