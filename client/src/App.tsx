import {
  Form,
  Button,
  Spinner,
  ListGroup,
  Container,
  InputGroup,
} from 'react-bootstrap'
import axios from 'axios'
import Todo from './components/Todo'
import ITodo from './interfaces/Todo'
import Loading from './components/Loading'
import AsyncData from './components/AsyncData'
import { FormEventHandler, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

type TInput = HTMLInputElement
const key = '/todos'

export default function App() {
  const queryClient = useQueryClient()
  const inputRef = useRef<TInput>(null)
  const todos = useQuery<ITodo[]>(key)

  const todosMutation = useMutation(async (text: string) => {
    const { data } = await axios.post<ITodo>(key, { text })
    return data
  })
  const handleSubmit: FormEventHandler = async event => {
    event.preventDefault()
    const input = inputRef.current

    // Terminate early with falsy values
    if (!input?.value.trim()) return

    // Make network request and update the query data
    const data = await todosMutation.mutateAsync(input.value)
    queryClient.setQueryData<ITodo[]>(key, old => (old ? [...old, data] : []))

    input.value = ''
  }

  const handleTodoDeleted = (deletedId: number) => {
    // Remove the item from the query data instantly
    queryClient.setQueryData<ITodo[]>(key, old =>
      old ? old.filter(todo => todo.id !== deletedId) : []
    )
  }

  const handleTodoEdited = (updated: ITodo) => {
    // Update the item from the query data instantly
    queryClient.setQueryData<ITodo[]>(key, old =>
      old ? old.map(todo => (todo.id === updated.id ? updated : todo)) : []
    )
  }

  return (
    <Container>
      <div className="mx-auto my-4 mt-5 p-4 rounded main-container">
        <AsyncData isLoading={todos.isLoading} data={todos.data}>
          {data => (
            <div>
              {!data.length && (
                <div className="text-center">
                  <img
                    className="img-fluid"
                    src="https://github.githubassets.com/images/modules/notifications/inbox-zero.svg"
                    alt="work"
                  />
                  <h5 className="mt-5">All caught up!</h5>
                </div>
              )}
              <ListGroup className="rounded-0">
                {data.map(todo => (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    onDeleted={handleTodoDeleted}
                    onEdited={handleTodoEdited}
                  />
                ))}
              </ListGroup>
            </div>
          )}
        </AsyncData>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 my-2">
            <Form.Control
              ref={inputRef}
              required
              type="text"
              placeholder="Add a new todo..."
            />
            <Button
              disabled={todosMutation.isLoading}
              variant="primary"
              type="submit"
              className="px-4"
            >
              {todosMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Add'
              )}
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Container>
  )
}
