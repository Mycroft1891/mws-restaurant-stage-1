let restaurant;
var map;

showMap = (mapPlaceholder) => {
  const mapElement = document.getElementById('map');
  mapPlaceholder.style.display = 'none';
  mapElement.style.display = 'block';
}
/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      self.map.addListener('idle', () => {
        document.getElementsByTagName('iframe')[0].title = restaurant.name;
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const favorite = document.getElementById('restaurant-favorite');
  favorite.innerHTML = restaurant.is_favorite ? "Saved as Favorite" : "Save as Favorite";
  favorite.style.backgroundColor = restaurant.is_favorite ? "#a56900" : "#708090";

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  let source = DBHelper.imageUrlForRestaurant(restaurant.photograph);
  image.src = source + '-small.jpg';
  image.srcset = `
    ${source + '-small.jpg'},
    ${source + '-medium.jpg'} 1.5x,
    ${source + '-large.jpg'} 2x,
  `
  image.alt = `Restaurant ${restaurant.name}`;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.reverse().forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.classList = 'review-name';
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.classList = 'review-date';
  date.innerHTML = formatDate(review.createdAt || new Date());
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.classList = 'review-rating';
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.classList = 'review-comments';
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Handle Review Form and favorite
 */

toggleFavorite = (button, restaurant = self.restaurant) => {
  restaurant.is_favorite = !restaurant.is_favorite;
  button.style.backgroundColor = restaurant.is_favorite ? "#a56900" : "#708090";
  button.innerHTML = restaurant.is_favorite ? "Saved as Favorite" : "Save as Favorite";
  IDB.updateRecord(restaurant);
  fetch(`http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`)
}
const form_alert = document.getElementById("form-alert")
let restaurant_id = window.location.href.split('=')[1];
let pending_reviews = [];

window.addEventListener('online', event => {
  if (pending_reviews.length == 0) return;
  pending_reviews.forEach(review => postReview(review))
});

window.addEventListener('offline', event => {
  console.log('Currently offline');
});

handleForm = (form) => {
  [name, rating, comment] = [form['name'].value, form['rating'].value, form['comment'].value];
  if (!name || !rating || !comment) {
    form_alert.hidden = false;
    return;
  }

  let payload = {
    "restaurant_id": restaurant_id,
    "name": name,
    "rating": rating,
    "comments": comment
  }

  if (window.navigator.onLine) {
    postReview(payload);
  } else {
    pending_reviews.push(payload);
  }

  const reviewsList = document.getElementById('reviews-list');
  reviewsList.prepend(createReviewHTML(payload));
  form_alert.hidden = true;
  form.reset();
  return false;
}

postReview = (payload) => {
  self.restaurant.reviews.push(payload);
  IDB.updateRecord(self.restaurant);
  fetch('http://localhost:1337/reviews/', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(res => res.json())
    .then(res => console.log(res));
}

formatDate = (time) => {
  const date = time ? new Date(time) : new Date();

  var months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var mIndex = date.getMonth();
  var year = date.getFullYear();

  return `${months[mIndex]} ${day}, ${year}`
}
