import express from "express"
import prisma from "../prismaClient"

const router = express.Router()

// get all todos
router.get('/', async (req, res) => {
    const todos = await prisma.todos.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

// create new todo
router.post("/", async (req, res) => {
    const { task } = req.body;

    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo)

})


// update a todo
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { completed } = req.body;

    const updatedTodo = await prisma.todos.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo)
})

// delet a todo
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const userId = req.userId

    await prisma.todo.delete({
        where: {
            id: parseFloat(id),
            userId
        }
    })

    res.status(201).send({ msg: "Deleted todo!" })
})

export default router