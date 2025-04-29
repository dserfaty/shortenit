import React, {useState} from "react"
import {Box, Button, Container, TextField} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import {isValidPassword, isValidUserName} from "../utils/validators.ts";
import {APIToken, createToken} from "../actions/api.ts";

interface ILoginProps {
    setCredentials: (credentials: APIToken) => void;
}

function Login({setCredentials}: ILoginProps) {
    const [userName, setUserName] = useState<string>("");
    const [userNameError, setUserNameError] = useState(false);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // console.log("username: ", userName, e)
        const value = e.target.value;
        setUserName(value)
        if (isValidUserName(value)) {
            setUserNameError(false);
        } else {
            setUserNameError(true);
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // console.log("password: ", password, e)
        const value = e.target.value;
        setPassword(value)
        if (isValidPassword(value)) {
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    }

    const credentialsAreNotValid = (): boolean => {
        return !isValidUserName(userName) || !isValidPassword(password)
    }

    const handleLogin = () => {
        console.log("login with username", userName);

        createToken(userName, password).then(
            result => {
                if ('error' in result) {
                    setErrorMessage(`Error! ${result.error}`);
                } else {
                    const credentials = result as APIToken;
                    setErrorMessage("");
                    setCredentials(credentials);
                }
            }
        )
    }

    return <Container maxWidth="lg">
        <p className={"instructions"}>Please enter your account credentials:</p>
        <Box sx={{mt: 4}}>
            <div className={"formFields"}>
                <TextField
                    id="userName"
                    label="User Name"
                    variant="filled"
                    fullWidth
                    required
                    placeholder="Enter your user name"
                    error={userNameError}
                    helperText={userNameError ? "Enter a valid user name" : ""}
                    className={"textField"}
                    value={userName}
                    onChange={(e) => handleUserNameChange(e)}
                />
                <TextField
                    id="password"
                    label="Password"
                    variant="filled"
                    type="password"
                    fullWidth
                    required
                    placeholder="Enter your password"
                    error={passwordError}
                    helperText={passwordError ? "Enter a valid password" : ""}
                    className={"textField"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e)}
                />
            </div>
            <div className={"formButtons"}>
                <Button variant="contained"
                        startIcon={<LoginIcon/>}
                        sx={{pt: 1}}
                        disabled={credentialsAreNotValid()}
                        onClick={() => handleLogin()}
                >
                    Login
                </Button>
            </div>
        </Box>
        <Box sx={{mt: 4}}>
        <span className={"shortenResultError"}>{errorMessage}</span>
        </Box>
    </Container>
}

export default Login;