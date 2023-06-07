import react from "react";
import Form from "../Components/form.js";
import { Box, Button, Typography } from "@mui/material";

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
        fetch(this.props.server_url + "/api/auth/login", {
          method: "POST",
          mode: 'cors',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept" : "application/json"
          },
          body: JSON.stringify(data),
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === true) {
            // Add logic for handling successful login
            this.props.changeScreen("lobby");
          } else {
            // Add logic for handling login failure
            console.log("Login failed: " + data.msg);
          }
        })
        .catch((error) => {
          // Add logic for handling login error
          console.log("Login error", error);
        });
      }
      

    register = (data) => {
        fetch(this.props.server_url + "/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.status === 201) {
                // Add logic for handling successful registration
                this.setState({showForm: false});
            }
            else {
                // Add logic for handling registration failure
                console.log("Registration failed");
            }
        })
        .catch((error) => {
            // Add logic for handling registration error
            console.log("Error during registration", error);
        });
      }
      
    


render() {
    let display = null;
    if (this.state.showForm) {
        let fields = [];
        if (this.state.selectedForm === "login") {
            fields = ['username', 'password'];
            display = <Form fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
        }
        else if (this.state.selectedForm === "register") {
            fields = [ 'username', 'password', 'name'];
            display = <Form fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>;
        }   
    }
    else {
        display = 
            <div>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
            </div>;
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