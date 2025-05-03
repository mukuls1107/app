import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prismaClient from "../prismaClient.js"

const router = express.Router();

router.post('/register', async (req, res) => {
    // console.log(`/auth/register endpoint hit`)
    // res.send(`Route successful`)

    const { username, password } = req.body;

    //encryptt the password
    const hashedPassword = bcrypt.hashSync(password, 8);
    // save the new user and hashed password to the database.

    try {
        const user = await prismaClient.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        // now that we have a user, I want to add their first todo for them

        const defaultTodo = `Hello :) Add your first todo!`;
        await prismaClient.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '24h' })
        console.log(`${username} signed up!`)
        res.json({ token });

    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.sendStatus(503)
        return;
    }
    // console.log(`Username: ${username}\nPassword: ${password}\nHashed Password: ${hashedPassword}`)
    // res.status(201).send(`Name is: ${username}`)
})



router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(`Username: ${username}\nPassword: ${password}`)

    try {

        const user = await prismaClient.user.findUnique({
            where: {
                username: username
            }
        })
        // IF user is not registerd
        if (!user) {
            return res.status(404).send({ message: `User Not Found with username: ${username}` });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        // If password is invalid
        if (!passwordIsValid) {
            return res.status(401).send({ message: `User not registerd` })
        }
        console.log(user)
        //successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '24h' })
        res.json({ token })

    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.sendStatus(503)

    }


    // const hashedPassword = bcrypt.hashSync(password, 8);

    // console.log(`Username: ${username}\nPassword: ${password}\nHashed Password: ${hashedPassword}`)
    // res.status(201).send(`${username} is trying to login   `)
})




export default router 