const express = require('express');

const app = express()
const env =require('dotenv').config();
const port = process.env.PORT || 3000;
const DB = require('./database/db');
const userRouter = require('./Routes/userRouter');
const adminRouter = require('./Routes/adminRouter');
const bcrypt = require ("bcrypt")
const User = require("./model/userSchema")
const fs = require('fs');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.use(helmet());

app.use('/api/v1/users', userRouter);

app.use('/api/v1/admin', adminRouter);


DB();

const limiter = rateLimit ({
    windows: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-8', // draft-6: `RateLimit` headers; draft-7 & draft-8: combined `RateLimit` headers;
   // Disable the 'X-RateLimit' headers.
    // store: ..., // Redis, Memcached, etc. See below 
});

app.use(limiter)

const options = {
    key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),

    cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
}

app.get('/', (req, res) => {
    res.send('Welcome to the Homepage!');
})

const server = https.createServer(options, app);

server.listen(port, () => {
    console.log(`Server is listening on port https://localhost:${port}`);  
});

// async function seedData () {
//     try {
//         for (let i = 0; i < 400; i++) {
//             const password = `password${i}`;

//             const hash = await bcrypt.hash(password, 10)

//             const user = new User ({
//                 userName: `Stdents${i}`,
//                 password: hash,
//                 email: `users${i}@example.com`
//             });
//             console.log(`seeding in progress ${user}`);

//             await user.save();  
//         }
//         console.log('Data seeded successfully');
        
//     } catch (error) {
//         console.log('Error seeding data:', error.message);
        
//     }
// }

// seedData();