import React from "react";
import { Button, TextField, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {io} from 'socket.io-client';
import Form from '../Components/form';

class Chatroom extends React.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001');
        this.messagesEndRef = React.createRef();
        this.state = {
            messages: [],
            newMessage: "",
            editFormVis: false,
            // editIndex: -1
        };
    }

    componentDidMount() {
        // Fetch messages from server
        fetch(this.props.server_url + `/api/messages/${this.props.room}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }    
        }).then((res) => {
            res.json().then((data) => {
                // TODO: set the messages state to the messages fetched from server
                // ... spreads array received from server into individual elements, allowing for concatenation
                this.setState({messages:[...data, ...this.state.messages]})
            });
        });

        this.socket.emit('join', {room: this.props.room, username: this.props.username})

        this.socket.on('message', message => {
            if (message.room === this.props.room) {
                this.setState({ messages: [...this.state.messages, message.message] });
            }
        });
    }

    editMessage = () => {

    }

    handleMessageChange = (event) => {
        this.setState({ newMessage: event.target.value });
    }

    handleMessageSend = () => {
        if (this.state.newMessage !== "") {
            const info = {
                message: this.state.newMessage,
                username: this.props.username,
            };
            // Send message to server
            this.socket.emit('message', info);
            // Clear input field
            this.setState({ newMessage: ""});
        }
    }

    // Go back to lobby
    handleBackClick = () => {
        this.socket.emit('leave', {room: this.props.room, username: this.props.username});
        this.props.changeScreen("lobby");
    }

    // Edit message when edit button is clicked
    handleEditClick = () => {
        // Create Form to allow new message to be entered
        // Allow Form to be toggled on and off with click of edit button
        // console.log("index: " + index)
        // this.setState({ editIndex: index });
        this.setState(prevState => ({editFormVis: !prevState.editFormVis}));
    }

    render(){
        return(
            <Box display="flex" flexDirection="column" height="100vh">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton aria-label="Go back" component="span" onClick={this.handleBackClick}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography component="div">
                        Room: {this.props.room}
                    </Typography>
                </Box>
                {/* Message display area */}
                <Box flexGrow={1} overflow="auto">
                    <List>
                        {this.state.messages.map((message) => (
                            <ListItem key={message.id}>
                                <ListItemText primary={`${this.props.username}: ${message}`} />
                                <IconButton
                                    aria-label="Edit"
                                    component="span"
                                    onClick={this.handleEditClick}
                                    color="primary"
                                    style={{ display: message.startsWith(this.props.username + ":") ? 'inline' : 'none' }}
                                >
                                    <EditIcon />
                                </IconButton>
                                {this.state.editFormVis && (
                                    <Form
                                        type='edit'
                                        fields={[message]}
                                        submit={this.editMessage}
                                        close={this.handleEditClick}
                                    />
                                )}
                            </ListItem>
                        ))}
                        <div ref={this.messagesEndRef} />
                    </List>
                </Box>
                {/* Input field */}
                <Box>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Type a message"
                        value={this.state.newMessage}
                        onChange={this.handleMessageChange}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={this.handleMessageSend}>
                                    Send
                                </Button>
                            ),
                        }}
                    />
                </Box>
            </Box>
        );
    }
}

export default Chatroom;
