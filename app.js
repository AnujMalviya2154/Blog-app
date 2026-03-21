
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let posts = [];

app.get('/', (req, res) => {
  res.render('home', { posts });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  const post = {
    id: uuidv4(),
    title: req.body.postTitle,
    content: req.body.postContent
  };
  posts.push(post);
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.render('edit', { post });
  } else {
    res.redirect('/');
  }
});

app.post('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    post.title = req.body.postTitle;
    post.content = req.body.postContent;
  }
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  posts = posts.filter(p => p.id !== req.params.id);
  res.redirect('/');
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render('post', { post });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
