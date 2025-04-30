import {useEffect, useState} from "react"
import {Container, Link} from "@mui/material";
import {APIToken} from "../actions/api.ts";
import {ComponentId} from "../config/config.ts";

interface IAppHeaderProps {
    credentials: APIToken;
    logout: () => void;
    showComponent: (id: ComponentId) => void;
}

function AppHeader({credentials, logout, showComponent}: IAppHeaderProps) {
    const [userName, setUserName] = useState<string>("");
    useEffect(() => {
        //console.log("header - credentials: ", credentials);
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
                <span className={"headerLink"}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            showComponent(ComponentId.Home);
                        }}
                    >
                      Shorten It!
                    </Link>
                </span>
                <span className={"headerLink"}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            showComponent(ComponentId.MyDashboard);
                        }}
                    >
                      My Dashboard
                    </Link>
                </span>
                <span className={"headerLink"}>
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