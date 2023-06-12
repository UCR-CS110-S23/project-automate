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
            searchMessage: "",
            editFormVis: false,
            timer: null
            // editIndex: -1
        };
    }

    fetchMessages = () => {
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
                this.setState({messages: data});
            });
        });
    }

    componentDidMount() {
        // Fetch messages from server
        this.fetchMessages();
        this.startMessageFetchTimer();
        this.socket.emit('join', {room: this.props.room, username: this.props.username})

        this.socket.on('message', message => {
            if (message.room === this.props.room) {
                this.setState((prevState) => ({
                    messages: [...prevState.messages, message.message],
                  }));
            }
        });
    }

    componentWillUnmount() {
        this.stopMessageFetchTimer(); // Clear the interval timer when the component is unmounted
    }

    startMessageFetchTimer = () => {
        const timer = setInterval(this.fetchMessages, 2000); // Fetch messages every 2 seconds (adjust the interval as needed)
        this.setState({ timer });
        console.log("refreshing messages");
    };

    stopMessageFetchTimer = () => {
        clearInterval(this.state.timer);
    };

    editMessage = () => {

    }

    handleMessageChange = (event) => {
        this.setState({ newMessage: event.target.value });
    }

    handleMessageSend = () => {
        if (this.state.newMessage !== "") {
            const info = {
                message: this.props.username + ": " + this.state.newMessage,
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

    handleSearchChange = (event) => {
        this.setState({ searchMessage: event.target.value });
    }

    render(){
        const filteredMessages = this.state.messages.filter(message => 
            message.toLowerCase().includes(this.state.searchMessage.toLowerCase())
        );
        return(
            <Box display="flex" flexDirection="column" height="100vh">
                <Box>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="search messages"
                        value={this.state.searchInput}
                        onChange={this.handleSearchChange}
                    />
                </Box>
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
                        {filteredMessages.map((message) => (
                            <ListItem key={message.id}>
                                <ListItemText primary={`${message}`} />
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
