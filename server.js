const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tattler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Definir el modelo
const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    building: String,
    coord: [Number],
    street: String,
    zipcode: String
  },
  borough: String,
  cuisine: String,
  grades: [
    {
      date: Date,
      score: Number
    }
  ],
  comments: [
    {
      date: Date,
      comment: String
    }
  ],
  restaurant_id: String
}));

// Rutas CRUD
app.get('/restaurants', async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

app.post('/restaurants', async (req, res) => {
  const newRestaurant = new Restaurant(req.body);
  await newRestaurant.save();
  res.json(newRestaurant);
});

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.json(restaurant);
});

app.put('/restaurants/:id', async (req, res) => {
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedRestaurant);
});

app.delete('/restaurants/:id', async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.id);
  res.json({ message: 'Restaurant deleted' });
});

// Endpoint para añadir comentarios
app.post('/restaurants/:id/comments', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  const newComment = {
    date: new Date(),
    comment: req.body.comment
  };
  restaurant.comments.push(newComment);
  await restaurant.save();
  res.json(restaurant);
});

// Endpoint para calificar restaurantes
app.post('/restaurants/:id/grades', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  const newGrade = {
    date: new Date(),
    score: req.body.score
  };
  restaurant.grades.push(newGrade);
  await restaurant.save();
  res.json(restaurant);
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
