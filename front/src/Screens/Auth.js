import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
        }
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {
        // TODO: write codes to login
        console.log(data);

        // send login request
        fetch("http://localhost:3001/api/auth/login",{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            username: data.username,
            password: data.password
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status) {
            // Login successful change screen to the lobby
            this.props.changeScreen("lobby");
            } else {
            // Login failed
            console.error("Login failed:", data.msg);
            this.props.changeScreen("auth");
            }
        })
        .catch((error) => {
            console.error("Login error:", error);
            // Handle fetch error
        });
    }
    

    register = (data) => {
        // TODO: write codes to register
        console.log(data);
        // Send registration request
        fetch("http://localhost:3001/api/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            username: data.username,
            password: data.password,
            name: data.name
            })
        })
            
    }
    
    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "login"){
                fields = ['username', 'password'];
                display = <Form fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm === "register"){
                fields = [ 'username', 'password', 'name'];
                display = <Form fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>;
            }   
        }
        else{
            display = <div>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
                </div>              ;
        }
        return(
            <div>
                <h1> Welcome to our website! </h1>
                {display}
            </div>
        );
    }
}

export default Auth;