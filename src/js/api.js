import axios from 'axios';

export const BASE_URL = 'https://pixabay.com/api/';
export const API_KEY = '39291497-afd0346a938db9581e617b7f9';

const optionsImage = async (searchQuery, perPage, numberPage) => {
    const params = new URLSearchParams({
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: numberPage,
        q: searchQuery,
    });
    

    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data;
};

export { optionsImage };
    
// export const BASE_URL = 'https://pixabay.com/api/';
// export const API_KEY = '39291497-afd0346a938db9581e617b7f9';
// export const options = {
//     params: {
//     key: API_KEY,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: 40,
//     page: 1,
//     q: '',
//     },
// };