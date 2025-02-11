
import './App.css'
import {Route, Routes} from "react-router-dom";
import {Header} from "./components/ui/Header.tsx";
import {Homepage} from "./pages/Homepage.tsx";
import {Login} from "./pages/Login.tsx";
import {Transaction} from "./pages/Transaction.tsx";
import {NotFound} from "./pages/NotFound.tsx";
import {SignUp} from "./pages/SignUp.tsx";
import {useQuery} from "@apollo/client";
import {GET_AUTHENTICATED_USER} from "./graphql/queries/user.query.ts";
import {Toaster} from "react-hot-toast";

function App() {


    const {loading, data, error} = useQuery(GET_AUTHENTICATED_USER)
    console.log('loading', loading, 'data', data, 'error', error)

  return (
    <>
        {data?.authUser && <Header />}
        <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/transaction/:id' element={<Transaction />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster/>
    </>
  )
}

export default App
