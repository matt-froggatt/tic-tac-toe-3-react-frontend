interface DataProps<T> {
  data: T;
  updateData: (...args: any) => void;
}

export default DataProps;
