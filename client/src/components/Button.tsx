import {
  Button as BootstrapButton,
  Spinner,
  ButtonProps,
} from 'react-bootstrap'
import { FC } from 'react'

interface Props extends ButtonProps {
  isLoading?: boolean
}

const Button: FC<Props> = ({
  isLoading = false,
  disabled,
  children,
  ...props
}) => (
  <BootstrapButton {...props} disabled={isLoading}>
    {isLoading ? <Spinner animation="border" size="sm" /> : children}
  </BootstrapButton>
)

export default Button
