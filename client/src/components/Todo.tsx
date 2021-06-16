import axios from 'axios'
import ITodo from '../interfaces/Todo'
import Button from '../components/Button'
import { useMutation } from 'react-query'
import { FC, FormEventHandler, useState, useRef } from 'react'
import { ListGroup, ButtonGroup, Form, InputGroup } from 'react-bootstrap'

interface Props {
  todo: ITodo
  onDeleted: (id: number) => any
  onEdited: (todo: ITodo) => any
}

const Todo: FC<Props> = ({ todo, onDeleted, onEdited }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const deleteMutation = useMutation(() => axios.delete(`/todos/${todo.id}`), {
    onSuccess: () => onDeleted(todo.id),
  })
  const editMutation = useMutation((text: string) =>
    axios.patch(`/todos/${todo.id}`, { text }).then(res => res.data)
  )

  const toggleIsEditing = () => setIsEditing(old => !old)

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault()
    const input = inputRef.current
    if (!input?.value) return

    const todo = await editMutation.mutateAsync(input.value)
    toggleIsEditing()
    onEdited(todo)
  }

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      {isEditing ? (
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control ref={inputRef} defaultValue={todo.text} required />
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
