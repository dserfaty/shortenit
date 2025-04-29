import React, {useState} from "react"
import clipboardCopy from "clipboard-copy";
import {Box, Button, Container, TextField} from "@mui/material";
import CopyIcon from '@mui/icons-material/CopyAll';
import LinkIcon from '@mui/icons-material/Link';
import {isValidURL} from "../utils/validators.ts";
import {APIToken, createShortUrl, ShortUrl} from "../actions/api.ts";

interface IURLCreateFormProps {
    credentials: APIToken;
}

function URLCreateForm({credentials}: IURLCreateFormProps) {
    const [url, setURL] = useState<string>("");
    const [shortURL, setShortURL] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [copyMessage, setCopyMessage] = useState<string>("");
    const [copyButtonEnabled, setCopyButtonEnabled] = useState<boolean>(false);
    const [urlError, setUrlError] = useState(false);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setURL(e.target.value)
        if (isValidURL(e.target.value)) {
            setUrlError(false);
        } else {
            setUrlError(true);
        }
    }

    const handleShortenURL = () => {
        if (!isValidURL(url)) { // This will be for the initial case so the button can stay enabled all the time
            return;
        }
        if (!credentials) {
            setErrorMessage(`Error! You are not logged in.`);
        } else {
            createShortUrl(url, credentials?.token).then(
                result => {
                    if ('error' in result) {
                        setMessage("");
                        setErrorMessage(`Error! could not shorten URL: ${result.error}`);
                        setShortURL("");
                        setCopyButtonEnabled(false);
                        setCopyMessage("");
                    } else {
                        const shortUrl = result as ShortUrl;
                        setMessage(`Success! Here is your short URL:`);
                        setErrorMessage("");
                        setShortURL(shortUrl.shortUrl);
                        setCopyButtonEnabled(true);
                        setCopyMessage("");
                    }
                }
            )
        }
    }

    return <Container className={"createForm"} maxWidth={false} disableGutters>
        <Box sx={{mt: 4}}>
            <div className={"formFields"}>
                <TextField
                    id="url"
                    label="URL"
                    variant="filled"
                    fullWidth
                    required
                    placeholder="Enter the URL to shorten"
                    error={urlError}
                    helperText={urlError ? "Enter a valid URL" : ""}
                    className={"textField"}
                    value={url}
                    onChange={(e) => handleUrlChange(e)}
                />
            </div>
            <div className={"formButtons"}>
                <Button
                    className={"shortenButton"}
                    variant="contained"
                    startIcon={<LinkIcon/>}
                    sx={{pt: 1}}
                    onClick={() => handleShortenURL()}
                >
                    Shorten It!
                </Button>
            </div>
        </Box>
        <Box sx={{mt: 4}}>
            <span className={"shortenResultSuccess"}>{message}</span>
            <span className={"shortenResultError"}>{errorMessage}</span>
            <span className={"shortenResultMessage"}>{shortURL}</span>
        </Box>
        {copyButtonEnabled &&
            <Box sx={{mt: 4}}>
                <div className={"formButtons"}>
                    <Button variant="contained"
                            startIcon={<CopyIcon/>}
                            onClick={() => {
                                clipboardCopy(shortURL).then(
                                    res => {
                                        console.log(res);
                                        setCopyMessage("URL copied to clipboard!");
                                    }
                                );
                            }}
                        // disabled={!copyButtonEnabled}
                    >
                        Copy
                    </Button>
                    <div className={"copyResult"}>
                        {copyMessage}
                    </div>
                </div>
            </Box>
        }
    </Container>
}

export default URLCreateForm;