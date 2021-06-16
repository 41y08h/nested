import { ReactElement } from 'react'
import Loading from './Loading'

type Props<T> = {
  data?: T
  isLoading: boolean
  isFetching?: boolean
  children: (data: T) => ReactElement
}

const AsyncData = <T extends object>({
  children,
  isLoading,
  data,
}: Props<T>): ReactElement | null => {
  return isLoading ? <Loading on /> : data ? children(data) : null
}

export default AsyncData
