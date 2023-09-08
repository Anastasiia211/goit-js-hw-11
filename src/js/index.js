import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { optionsImage } from './api';

const elements = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
};


let perPage;
let queryValue;
let page;

elements.form.addEventListener('submit', onFormSubmit);
elements.loadBtn.addEventListener('click', onLoadMore) ;

async function onFormSubmit(evt) {
    evt.preventDefault();
    elements.loadBtn.classList.add('hidden');
    const { searchQuery } = evt.target;

    page = 1;
    perPage = 40;

    try {
         const result = await optionsImage(searchQuery.value, perPage, page);

        if (result.hits.length > 0) {
            Notify.success(`Hooray! We found ${result.totalHits} images.`);
            elements.gallery.innerHTML = createMarcup(result.hits);
               
            resultScroll();

            let lightbox = new SimpleLightbox('.galleryList', {
                captionsData: 'alt',
                captionDelay: 250,
            });
               
               
            if (result.totalHits > perPage) {
                elements.loadBtn.classList.remove('hidden');
                queryValue = searchQuery.value;
                return queryValue;
            }
        } else {
            elements.gallery.innerHTML = '';
            Notify.failure('Sorry, there are no images matching your search query');
            
        }
        
        } catch {
        Notify.failure('Please try again.');
        }
    }
    
    async function onLoadMore () {
        page += 1;
        
        try {
            const result = await optionsImage(perPage, queryValue, page);
            elements.gallery.insertAdjacentHTML('beforeend', createMarcup(result.hits));
            resultScroll();
            
                let lightbox = new SimpleLightbox('.galleryList', {
                captionsData: 'alt',
                captionDelay: 250,
                });
            lightbox.refresh();

            if (Math.ceil(result.totalHits / perPage) === page) {
                elements.loadBtn.classList.add('hidden');
                Notify.info("We're sorry, but you've reached the end of search results.");
            }
        } catch {
            
            Notify.failure('Please try again.');
        }
    }

    function createMarcup(arr) {
        return arr
            .map(
                ({ webformatURL,
                    largeImageURL,
                    tags,
                    likes,
                    views,
                    comments,
                    downloads
                }) =>
                    `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`
        )
            .join('');
 
    }
    
    function resultScroll() {
              const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
        
        
}

// import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { BASE_URL, options} from './api'
// import { elements } from './elements';


// const { searchForm, inputName, gallery,loader } = elements;

// let totalHits = 0;
// let isLoadingMore = false;
// let pageEnd = false;

// searchForm.addEventListener('submit', onFormSubmit);
// window.addEventListener('scroll', onHandlerScroll);
// document.addEventListener('DOMContentLoaded', docHundler);

// const lightbox =  new SimpleLightbox('.lightbox', {
//     captionsData: 'alt',
//     captionDelay: 250,
//     enableKeyboard: true,
// });

// function showLoader() {
//   loader.style.display = 'block';
// }

// function docHundler() {
//   loader.style.display = 'none';
// }



// function newGallery(hits) {
//     const markup = hits
//         .map(item => {
//         return  `
//             <a href="${item.largeImageURL}" class="lightbox">
//                 <div class="photo-card">
//                     <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
//                     <div class="info">
//                         <p class="info-item">
//                             <b>Likes</b>
//                             ${item.likes}
//                         </p>
//                         <p class="info-item">
//                             <b>Views</b>
//                             ${item.views}
//                         </p>
//                         <p class="info-item">
//                             <b>Comments</b>
//                             ${item.comments}
//                         </p>
//                         <p class="info-item">
//                             <b>Downloads</b>
//                             ${item.downloads}
//                         </p>
//                     </div>
//                 </div>
//             </a>
//             `;
//         })
//         .join('');
    
//     gallery.insertAdjacentHTML('beforeend', markup);

//     if (options.params.page * options.params.per_page >= totalHits) {
//         if (!pageEnd) {
//             Notify.info("We're sorry, but you've reached the end of search results.");
//             pageEnd = true;
//         }
//     }
//     lightbox.refresh();
// }

// async function loadMore() {
//     isLoadingMore = true;
//     options.params.page += 1;
//     try {
//         showLoader();
//         const response = await axios.get(BASE_URL, options);
//         const hits = response.data.hits;
//         newGallery(hits);
//     } catch (err) {
//         Notify.failure(err);
//         docHundler();
//     } finally {
//         docHundler();
//         isLoadingMore = false;
//     }
// }

// function onHandlerScroll() {
//     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//     const scrollThreshold = 300;
//     if (
//         scrollTop + clientHeight >= scrollHeight - scrollThreshold &&
//         gallery.innerHTML !== '' &&
//         !isLoadingMore &&
//         !pageEnd
//     ) {
//         loadMore();
//     }
// }

// // function onHandlerScroll() {
// //     const { height: cardHeight } = document
// //         .querySelector('.gallery')
// //         .firstElementChild.getBoundingClientRect();

// //     window.scrollBy({
// //         top: cardHeight * 2,
// //         behavior: 'smooth',
// //     });
// //     loadMore();
// // }

// async function onFormSubmit(e) {
//     e.preventDefault();
//     options.params.q = inputName.value.trim();
//     if (options.params.q === '') {
//         return;
//     }
//     options.params.page = 1;
//     gallery.innerHTML = '';
//     pageEnd = false;

//     try {
//     showLoader();
//     const response = await axios.get(BASE_URL, options);
//     totalHits = response.data.totalHits;
//     const hits = response.data.hits;
//     if (hits.length === 0) {
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       Notify.success(`Hooray! We found ${totalHits} images.`);
//       newGallery(hits);
//     }
//     searchInput.value = '';
//     docHundler();
//   } catch (err) {
//     Notify.failure(err);
//     docHundler();
//   }
// }



