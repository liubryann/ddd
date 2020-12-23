import axios from 'axios';

var url;
if( process.env.NODE_ENV === 'development') {
  url = `http://127.0.0.1:8000/`;
}
else {
    url = `https://secret-temple-69179.herokuapp.com/`
}

export default axios.create({
    baseURL: url,
});