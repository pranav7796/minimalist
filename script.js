const postBtn = document.getElementById('post-btn');
const postInput = document.getElementById('post-input');
const feed = document.getElementById('feed');
const imageInput = document.getElementById('imagePost');

// Function to render posts
function renderPosts() {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  feed.innerHTML = '';
  posts.forEach((post, index) => {
    const postElement = createPostElement(post, index);
    feed.appendChild(postElement);
  });
}

// Function to create a post element
function createPostElement(post, index) {
  const postElement = document.createElement('div');
  postElement.className = 'post';

  if (post.image) {
    const img = document.createElement('img');
    img.src = post.image;
    postElement.appendChild(img);
  }

  const text = document.createElement('p');
  text.textContent = post.text;
  postElement.appendChild(text);

  const likeBtn = document.createElement('button');
  likeBtn.textContent = `Like (${post.likes})`;
  likeBtn.className = `like-btn ${post.liked ? 'active' : ''}`;
  likeBtn.addEventListener('click', () => toggleLike(index));
  postElement.appendChild(likeBtn);

  const commentInput = document.createElement('input');
  commentInput.className = 'comment-input';
  commentInput.placeholder = 'Add a comment...';
  postElement.appendChild(commentInput);

  const commentBtn = document.createElement('button');
  commentBtn.textContent = 'Comment';
  commentBtn.className = 'comment-btn';
  commentBtn.addEventListener('click', () => addComment(index, commentInput.value));
  postElement.appendChild(commentBtn);

  const comments = document.createElement('div');
  comments.className = 'comments';
  post.comments.forEach((comment) => {
    const commentText = document.createElement('p');
    commentText.textContent = comment;
    comments.appendChild(commentText);
  });
  postElement.appendChild(comments);

  return postElement;
}

// Function to handle likes
function toggleLike(index) {
  const posts = JSON.parse(localStorage.getItem('posts'));
  posts[index].liked = !posts[index].liked;
  posts[index].likes += posts[index].liked ? 1 : -1;
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// Function to add comments
function addComment(index, comment) {
  if (!comment.trim()) return;
  const posts = JSON.parse(localStorage.getItem('posts'));
  posts[index].comments.push(comment);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// Function to handle new posts
postBtn.addEventListener('click', () => {
  const text = postInput.value.trim();
  const file = imageInput.files[0];

  if (!text && !file) return alert('Please write something or upload an image!');

  const reader = new FileReader();
  reader.onload = (e) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift({
      text,
      image: file ? e.target.result : null,
      likes: 0,
      liked: false,
      comments: [],
    });
    localStorage.setItem('posts', JSON.stringify(posts));
    postInput.value = '';
    imageInput.value = '';
    renderPosts();
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift({ text, image: null, likes: 0, liked: false, comments: [] });
    localStorage.setItem('posts', JSON.stringify(posts));
    postInput.value = '';
    renderPosts();
  }
});

// Initial render
document.addEventListener('DOMContentLoaded', renderPosts);
