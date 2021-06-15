import { http } from './http';
import { ui } from './ui';

// Api Production
const urlAPI = 'https://json-server-dev.herokuapp.com/posts';

// API Development
const urlAPIDev = 'http://localhost:3000/posts';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

// Listen for delete post
document.querySelector('#posts').addEventListener('click', deletePost);

// Listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

// Lister for cancel
document.querySelector('.card-form').addEventListener('click', cancelEdit);

// Get posts
function getPosts() {
  http
    .get(urlAPI)
    .then((data) => {
      ui.showPosts(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

// submit Post
function submitPost(e) {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  const data = {
    title,
    body,
  };

  // Validate input
  if (title === '' || body === '') {
    ui.showAlert('Please fill in all fields', 'alert alert-danger');
  } else {
    // Check for ID
    if (id === '') {
      // Create Post
      http
        .post(urlAPI, data)
        .then((data) => {
          ui.showAlert('Post added', 'alert alert-success');
          ui.clearFields();
          getPosts();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      // Update Post
      http
        .put(`${urlAPI}/${id}`, data)
        .then((data) => {
          ui.showAlert('Post updated', 'alert alert-success');
          ui.changeFormState('add');
          getPosts();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
}

// Delete post
function deletePost(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id;
    if (confirm('Are you sure ?')) {
      http
        .delete(`${urlAPI}/${id}`)
        .then(() => {
          ui.showAlert('Post removed', 'alert alert-success');
          getPosts();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
}

// Enable edit
function enableEdit(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    const data = {
      id,
      title,
      body,
    };

    // Fill form with current
    ui.fillForm(data);
  }
}

// Cancel Edit State
function cancelEdit(e) {
  e.preventDefault();
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }
}
