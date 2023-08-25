import { Route, Routes } from 'react-router-dom'
import Todo from './Todo/Todo'
import SignUp from './Sign/SignUp'
import SignIn from './Sign/SignIn'

function App() {
  return (
    <Routes>
      <Route path="/todo" element={<Todo />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  )
}

export default App
