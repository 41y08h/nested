import {
  Container,
  Spinner,
  ListGroup,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ITodo from "./interfaces/Todo";
import { FormEventHandler, useRef } from "react";
import axios from "axios";
import Todo from "./components/Todo";

function App() {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery<ITodo[]>("/todos");
  const inputRef = useRef<HTMLInputElement>(null);
  const todosMutation = useMutation((text: string) =>
    axios.post<ITodo>("/todos", { text }).then((res) => res.data)
  );

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input?.value) return;

    const data = await todosMutation.mutateAsync(input.value);
    input.value = "";

    queryClient.setQueryData<ITodo[]>("/todos", (old) =>
      old ? [...old, data] : []
    );
  };

  const handleTodoDeleted = (id: number) => {
    queryClient.setQueryData<ITodo[]>("/todos", (old) =>
      old ? old.filter((todo) => todo.id !== id) : []
    );
  };

  const handleTodoEdited = (updatedTodo: ITodo) => {
    queryClient.setQueryData<ITodo[]>("/todos", (old) =>
      old
        ? old.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        : []
    );
  };

  return (
    <Container>
      <div
        className="mx-auto my-4 mt-5 p-4 rounded"
        style={{ width: "100%", maxWidth: "28rem" }}
      >
        {isLoading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" />
          </div>
        )}
        {data && (
          <>
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
              {data.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  onDeleted={handleTodoDeleted}
                  onEdited={handleTodoEdited}
                />
              ))}
            </ListGroup>
          </>
        )}
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
                "Add"
              )}
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Container>
  );
}

export default App;
