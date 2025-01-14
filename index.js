const express = require('express');

const app = express();
const env =require('dotenv').config();
const port = process.env.PORT || 3000;
const DB = require('./database/db');
const userRouter = require('./Routes/userRouter');
const adminRouter = require('./Routes/adminRouter');

app.use(express.json());

app.use('/api/v1/users', userRouter);

app.use('/api/v1/admin', adminRouter);

DB();

app.get('/', (req, res) => {
    res.send('Welcome to the Homepage!');
})

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);  
});

async function seedData () {
    try {
        for (let i = 0; i < 400; i++) {
            const password = `password${i}`;

            const hash = await bcrypt.hash(password, 10)

            const user = new User ({
                userName: `Stdents${i}`,
                password: hash,
                email: `users${i}@example.com`
            });
            console.log(`seeding in progress ${user}`);

            await user.save();  
        }
        console.log('Data seeded successfully');
        
    } catch (error) {
        console.log('Error seeding data:', error.message);
        
    }
}

seedData();