import db from '../db'
import IController from '../interfaces/Controller'
import { ITodo } from '@nested/common'

const Todos: IController = {
  route: '/todos',
  handlers: [
    {
      path: '/',
      async handle(req, res) {
        const { rows: todos } = await db.query<ITodo>(`select * from todos`)
        res.json(todos)
      },
    },
    {
      path: '/',
      method: 'post',
      async handle(req, res) {
        const { text }: { text: string } = req.body
        const {
          rows: [todo],
        } = await db.query<ITodo>(
          `insert into todos (text) values ($1) returning *`,
          [text]
        )

        res.status(201).json(todo)
      },
    },
    {
      path: '/:id',
      method: 'patch',
      async handle(req, res) {
        const todoId = parseInt(req.params.id)
        const text: string = req.body.text

        const {
          rows: [todo],
        } = await db.query<ITodo>(
          `
          update todos 
          set text = coalesce($1, todos.text)
          where id = $2 
          returning *
          `,
          [text, todoId]
        )

        res.json(todo)
      },
    },
    {
      path: '/:id',
      method: 'delete',
      async handle(req, res) {
        const todoId = parseInt(req.params.id)
        const { rowCount } = await db.query<ITodo>(
          `delete from todos where id = $1`,
          [todoId]
        )

        rowCount === 1 ? res.sendStatus(200) : res.sendStatus(400)
      },
    },
  ],
}

export default Todos
