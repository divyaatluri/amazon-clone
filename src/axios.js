import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/clone-3a193/us-central1/api' //THe API (cloud function) URL
});

export default instance;