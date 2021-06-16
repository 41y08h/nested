import axios from 'axios'
import { ITodo } from '@nested/common'
import Button from '../components/Button'
import { useMutation } from 'react-query'
import { FC, FormEventHandler, useState, useRef } from 'react'
import { ListGroup, ButtonGroup, Form, InputGroup } from 'react-bootstrap'

interface Props {
  todo: ITodo
  onDeleted: (id: number) => any
  onEdited: (todo: ITodo) => any
}

type TInput = HTMLInputElement

const Todo: FC<Props> = ({ todo, onDeleted, onEdited }) => {
  const inputRef = useRef<TInput>(null)
  const [isEditing, setIsEditing] = useState(false)
  const deleteMutation = useMutation(() => axios.delete(`/todos/${todo.id}`), {
    onSuccess: () => onDeleted(todo.id),
  })
  const editMutation = useMutation(async (text: string) => {
    const { data } = await axios.patch<ITodo>(`/todos/${todo.id}`, { text })
    return data
  })

  const toggleIsEditing = () => setIsEditing(old => !old)

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault()
    // Terminate early with falsy values
    const input = inputRef.current
    if (!input?.value.trim()) return

    const todo = await editMutation.mutateAsync(input.value)
    toggleIsEditing()
    onEdited(todo)
  }

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      {isEditing ? (
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              autoFocus
              ref={inputRef}
              defaultValue={todo.text}
              required
            />
            <Button
              isLoading={editMutation.isLoading}
              variant="primary"
              type="submit"
              className="px-4"
            >
              ⬆
            </Button>
          </InputGroup>
        </Form>
      ) : (
        <span>{todo.text}</span>
      )}
      <ButtonGroup>
        <Button onClick={toggleIsEditing} variant="secondary">
          🖊
        </Button>
        <Button
          isLoading={deleteMutation.isLoading}
          variant="light"
          onClick={() => deleteMutation.mutate()}
        >
          ❌
        </Button>
      </ButtonGroup>
    </ListGroup.Item>
  )
}

export default Todo
