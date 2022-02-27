import "./App.css";
import LoginForm	from "../src/login/LoginForm";
import React		from "react";
import PrimeReact	from "primereact/api";

function App() 
{
	PrimeReact.ripple = true;
	return (<div><LoginForm/></div>);
}

export default App;
