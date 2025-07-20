document.getElementById('reviewForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;

  const review = document.createElement('div');
  review.innerHTML = `<strong>${name}</strong> (${rating} stars): <p>${comment}</p><hr>`;

  document.getElementById('reviewsContainer').appendChild(review);
  document.getElementById('reviewForm').reset();
  document.getElementById('successMessage').style.display = 'block';
});