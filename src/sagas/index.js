const mockFunc = () => console.log('Root Saga');

export default function* rootSaga() {
  yield mockFunc;
}
