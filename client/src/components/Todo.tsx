import axios from "axios";
import { FC } from "react";
import { useMutation } from "react-query";
import ITodo from "../interfaces/Todo";
import { ListGroup, Button, Spinner } from "react-bootstrap";

interface Props {
  todo: ITodo;
  onDeleted: (id: number) => any;
}

const Todo: FC<Props> = ({ todo, onDeleted }) => {
  const deleteMutation = useMutation(() => axios.delete(`/todos/${todo.id}`), {
    onSuccess: () => onDeleted(todo.id),
  });

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <span>{todo.text}</span>
      <Button
        disabled={deleteMutation.isLoading}
        variant="light"
        onClick={() => deleteMutation.mutate()}
      >
        {deleteMutation.isLoading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          "❌"
        )}
      </Button>
    </ListGroup.Item>
  );
};

export default Todo;
