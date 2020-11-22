import axios from 'axios';

var url;
if( process.env.NODE_ENV === 'development') {
  url = `http://localhost:4000/`;
}
else {
    url = `https://secret-temple-69179.herokuapp.com/`
}

export default axios.create({
    baseURL: url,
});