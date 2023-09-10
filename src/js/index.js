import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { optionsImage } from './api';

const elements = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
};


let perPage;
let queryValue = '';
let page;

elements.form.addEventListener('submit', onFormSubmit);
elements.loadBtn.addEventListener('click', onLoadMore) ;

async function onFormSubmit(evt) {
    evt.preventDefault();
    elements.loadBtn.classList.add('hidden');
    const { searchQuery } = evt.target;

    page = 1;
    perPage = 40;
      
 if (searchQuery.value) {
    try {
        const result = await optionsImage(searchQuery.value, perPage, page);

         if (searchQuery.value.trim() === '') {
            Notify.failure('Please enter a search query.');
            return;
        }

        if (result.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
            elements.gallery.innerHTML = createMarcup(result.hits);
               
            resultScroll();

        let lightbox = new SimpleLightbox('.gallery a', {
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
            Notiflix.Notify.failure('Sorry, there are no images matching your search query');
            
        }
    } catch (e) {
      console.error(e);
    }
  } else {
    Notiflix.Notify.failure('Please enter a search query.');
  }
}
    
    
    async function onLoadMore () {
        page += 1;
        
        try {
            const result = await optionsImage(queryValue,perPage, page);
            elements.gallery.insertAdjacentHTML('beforeend', createMarcup(result.hits));
            resultScroll();
            
                let lightbox = new SimpleLightbox('.gallery a', {
                captionsData: 'alt',
                captionDelay: 250,
                });
            lightbox.refresh();
            

            if (Math.ceil(result.totalHits / perPage) === page) {
                elements.loadBtn.classList.add('hidden');
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
        } catch {
            
            Notiflix.Notify.failure('Please try again.');
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
        <a class="photo-card-link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
              <p class="info-item">
                  <b>Likes</b>
                  ${likes}
              </p>
              <p class="info-item">
                  <b>Views</b>
                  ${views}
              </p>
              <p class="info-item">
                  <b>Comments</b>
                  ${comments}
              </p>
              <p class="info-item">
                  <b>Downloads</b>
                  ${downloads}
              </p>
          </div>
        </a>
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











