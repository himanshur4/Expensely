import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import TransactionPage from "./pages/TransactionPage"
import NotFoundPage from "./pages/NotFoundPage"
import Header from "./components/ui/Header"
import { useQuery } from "@apollo/client"
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query.js"
import { Toaster } from "react-hot-toast"

function App() {
	const {data,loading,error}=useQuery(GET_AUTHENTICATED_USER);
	
	if(loading) return null;
	return (
		<>
			{data?.authUser && <Header />}
			<Routes>
				<Route path='/' element={data.authUser?<HomePage />:<Navigate to="/signup"/>} />
				<Route path='/login' element={!data.authUser?<LoginPage />:<Navigate to="/"/>} />
				<Route path='/signup' element={!data.authUser?<SignUpPage />:<Navigate to="/"/>} />
				<Route path='/transaction/:id' element={<TransactionPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster/>
		</>
	);
}
export default App;