const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());


mongoose.connect('mongodb+srv://rifqirival444:5MRauosXHFyc7H62@sbd7.hzjutlg.mongodb.net/?retryWrites=true&w=majority&appName=SBD7', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
