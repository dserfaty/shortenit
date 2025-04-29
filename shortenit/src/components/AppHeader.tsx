import {useEffect, useState} from "react"
import {Container, Link} from "@mui/material";
// import {useGlobalState} from "./GlobalStateProvider";
import {APIToken} from "../actions/api.ts";

interface IAppHeaderProps {
    credentials: APIToken;
    logout: () => void;
}

function AppHeader({credentials, logout}: IAppHeaderProps) {
    const [userName, setUserName] = useState<string>("");
    // const {state} = useGlobalState();
    useEffect(() => {
        console.log("header - credentials: ", credentials);
        if (credentials.account) {
            setUserName(credentials.account.userName)
        } else {
            setUserName("")
        }
    })

    return <Container maxWidth="lg">
        {userName != "" ?
            <div className="appHeader">
                <span className={"shortenResultSuccess"}>Hello {userName}!</span>
                <span>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            logout();
                        }}
                    >
                      Logout
                    </Link>
                </span>
            </div>
            : <div className="appHeader"></div>
        }
    </Container>
}

export default AppHeader;