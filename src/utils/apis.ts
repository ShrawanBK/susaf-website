import axios from 'axios';

type ProjectMode = 'development' | 'production';
export const projectMode: ProjectMode = 'development';

export default axios.create({
    // baseURL: 'http://35.228.111.234:3000/',
    baseURL: 'https://vast-meadow-55564.herokuapp.com',
    responseType: 'json',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    },
});
