import {
  Container,
  Spinner,
  ListGroup,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ITodo from "./interfaces/Todo";
import { FormEventHandler, useRef } from "react";
import axios from "axios";

function App() {
  const { isLoading, data } = useQuery<ITodo[]>("/todos");
  const inputRef = useRef<HTMLInputElement>(null);
  const todosMutation = useMutation((text: string) =>
    axios.post("/todos", { text }).then((res) => res.data)
  );

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input?.value) todosMutation.mutate(input.value);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Todos</h1>
      <div className="col-6 mx-auto my-4">
        {isLoading && <Spinner animation="border" />}
        {data && (
          <ListGroup.Item>
            {data.map((todo) => (
              <ListGroup.Item>{todo.text}</ListGroup.Item>
            ))}
          </ListGroup.Item>
        )}
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 my-2">
            <Form.Control
              ref={inputRef}
              required
              type="text"
              placeholder="Add a new todo..."
            />
            <Button variant="dark" type="submit">
              Add
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Container>
  );
}

export default App;
