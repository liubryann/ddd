import './App.css';

// Theme
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeObj from './util/theme';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
// Router 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Components 
import NavBar from './components/NavBar'
import ErrorBoundary from './components/ErrorBoundary';
// Pages 
import Home from './pages/Home';

const theme = createMuiTheme(themeObj);

function App() {
  return (
    <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <NavBar />
              <Switch>
                <Route exact path="/" component={Home}/>
              </Switch>
          </Router>
        </Provider>
      </MuiThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
