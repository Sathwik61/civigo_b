require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(cors("*"));
app.use('/',(req,res)=>{return res.json({message:"Welcome to the entry"})});
app.use('/api/auth', authRoutes);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB\n'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
