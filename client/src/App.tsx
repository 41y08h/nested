import {
  Container,
  Spinner,
  ListGroup,
  Form,
  InputGroup,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ITodo from "./interfaces/Todo";
import { FormEventHandler, useRef } from "react";
import axios from "axios";
import Todo from "./components/Todo";

function App() {
  const queryClient = useQueryClient();
  const { isLoading, data, isFetching } = useQuery<ITodo[]>("/todos");
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

  return (
    <Container>
      <h1 className="text-center my-4">Todos</h1>
      <div className="col-6 mx-auto my-4">
        {isFetching && <ProgressBar animated now={100} className="rounded-0" />}
        {isLoading && <Spinner animation="border" />}

        {data && (
          <>
            {!data.length && <p>No todos yet</p>}
            <ListGroup className="rounded-0">
              {data.map((todo) => (
                <Todo todo={todo} onDeleted={handleTodoDeleted} />
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
              variant="dark"
              type="submit"
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
