import react from "react";
import { Button, Grid } from "@mui/material";
import Form from '../Components/form';

class Lobby extends react.Component {
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
            createFormVisible: false,
            joinFormVisible: false,
            deleteFormVisible: false,
            error: null,
        }
    }

    componentDidMount(){
        // TODO: write codes to fetch all rooms from server
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                this.setState({rooms:data})
            });
        });
    }

    logout = () => {
        // Logout the user
        fetch(this.props.server_url + "/api/auth/logout", {
            method: "GET",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/json"
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status === true) {
                // If logout is successful, change screen to auth
                this.props.changeScreen("auth");
            } else {
                // Else, handle the failure
                this.setState({
                    error: "Logout failed: " + data.msg,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Handle logout error
            console.log("Logout error", error);
        });
    }
    
    createRoom = (data) => {
        // Create a new room
        // Write according to backend API
        fetch(this.props.server_url + "/api/rooms/create", {
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
            if (data.message === "Room created") {
                // If room is created, refresh the list of rooms
                this.refreshRooms();
            } else {
                // Else, handle the failure
                this.setState({
                    error: "Room creation failed: " + data.message,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Handle room reaction error
            console.log("Room creation error", error);
        });
    }
    
    refreshRooms = () => {
        // Refresh the list of rooms
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                // Update the list of rooms
                this.setState({rooms:data})
            });
        });
    }

    joinRoom = (data) => {
        // Join a room
        // Write according to backend API
        fetch(this.props.server_url + "/api/rooms/join", {
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
            if (data.message === "Joined room") {
                // If room is joined, refresh the list of rooms
                this.refreshRooms();
            } else {
                // Else, handle the failure
                this.setState({
                    error: "Room creation failed: " + data.message,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Handle room join error
            console.log("Room join error", error);
        });
    }
    
    deleteRoom = (data) => {
        // Delete a room
        // Write according to backend API
        fetch(this.props.server_url + "/api/rooms/leave", {
            method: "DELETE",
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
            if (data.message === "Left room") {
                // If room is deleted, refresh the list of rooms
                this.refreshRooms();
            } else {
                // Else, handle the failure
                this.setState({
                    error: "Room deletion failed: " + data.message,
                    openSnackbar: true
                });
            }
        })
        .catch((error) => {
            // Handle room deletion error
            console.log("Room deletion error", error);
        });
    }

    handleJoinRoom = () => {
        // Toggle visibility of join room form
        this.setState(prevState => ({joinFormVisible: !prevState.joinFormVisible}));
    }

    handleCreateRoom = () => {
        // Toggle visibility of create room form
        this.setState(prevState => ({createFormVisible: !prevState.createFormVisible}));
    }

    handleDeleteRoom = () => {
        // Toggle visibility of delete room form
        this.setState(prevState => ({deleteFormVisible: !prevState.deleteFormVisible}));
    }
    
    render(){
        return(
            <div>
                <h1>Lobby</h1>
                <Grid>
                    <Grid>
                        <div>
                            <Button onClick={this.handleCreateRoom}>
                                Create Room
                            </Button>
                            {this.state.createFormVisible && 
                                <Form
                                    type='Create Room'
                                    fields={['name']}
                                    submit={this.createRoom}
                                    close={this.handleCreateRoom}
                                />
                            }

                            <Button onClick={this.handleJoinRoom}>
                                Join Room
                            </Button>
                            {this.state.joinFormVisible && 
                                <Form
                                    type='Join Room'
                                    fields={['roomName']}
                                    submit={this.joinRoom}
                                    close={this.handleJoinRoom}
                                />
                            }

                            <Button onClick={this.handleDeleteRoom}>
                                Leave Room
                            </Button>
                            
                            {this.state.deleteFormVisible && 
                                <Form
                                    type='Delete Room'
                                    fields={['roomName']}
                                    submit={this.deleteRoom}
                                    close={this.handleDeleteRoom}
                                />
                            }
                            <Button onClick={this.logout}>
                                Logout
                            </Button>
                        </div>
                    </Grid>
                    <Grid>
                    {this.state.rooms ? this.state.rooms.map((room) => {
                        return (
                            <Button variant="contained" key={"roomKey"+room._id} onClick={() => this.props.changeScreen("chatroom", room.name)}>
                                {room.name}
                            </Button>
                        )
                    }) : "loading rooms..."}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Lobby;
