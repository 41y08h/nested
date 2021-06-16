import { FC } from "react";
import { Spinner } from "react-bootstrap";

const Loading: FC<{ on?: boolean }> = ({ on = true }) =>
  on ? (
    <div className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" />
    </div>
  ) : null;

export default Loading;
