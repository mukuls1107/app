import express from "express"
import path, { dirname } from "path"
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000


// Get the file path from the current root folder from public/index.html

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Middlewares
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


app.use('/auth', authRoutes)
app.use("/todo", authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`Connected to port:${process.env.PORT}`)
})