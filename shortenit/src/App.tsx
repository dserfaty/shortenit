import reactLogo from './assets/shortenit.svg'
import './App.css'
import URLCreateForm from "./components/URLCreateForm.tsx";
import Login from "./components/Login.tsx";
import {useEffect, useState} from "react";
import AppHeader from "./components/AppHeader.tsx";
import {APIToken} from "./actions/api.ts";
import MyDashboard from "./components/MyDashboard.tsx";
import {ComponentId} from "./config/config.ts";

function App() {
    const [credentials, setCredentials] = useState({} as APIToken);
    const [myDashboardVisible, setMyDashboardVisible] = useState(false);

    function isLoggedIn(): boolean {
        // console.log("state: ", state);
        return credentials.token != null;
    }

    // call back to update credentials from login
    const updateCredentials = (credentials: APIToken) => {
        // console.log("updating credentials: ", credentials);
        localStorage.setItem('credentials', JSON.stringify(credentials, null, 4));
        setCredentials(credentials);
    }

    const logout = () => {
        localStorage.removeItem('credentials');
        setCredentials({} as APIToken);
        setMyDashboardVisible(false);
    }

    // load credentials from local storage
    useEffect(() => {
        if (!credentials.token) {
            const value = localStorage.getItem('credentials');
            if (value) {
                const storedCredentials: APIToken = JSON.parse(value);
                setCredentials(storedCredentials);
                // console.log("local storage?: ", value);
            }
        }
    }, [credentials])

    const showComponent = (id: ComponentId) => {
        if (id == ComponentId.MyDashboard) {
            setMyDashboardVisible(true);
        } else {
            setMyDashboardVisible(false);
        }
    }

    return (
        <div>
            <div>
                <AppHeader credentials={credentials} logout={logout} showComponent={showComponent}/>
            </div>
            <div>
                <img src={reactLogo} className="logo react" alt="React logo"/>
            </div>
            <h1 className="title">Shorten It!</h1>
            <div className="card">
                <p className={"subtitle"}>Shorten It! A URL Shortener.</p>
                {isLoggedIn() ?
                    <div>
                        {myDashboardVisible ?
                            <MyDashboard credentials={credentials}/> :
                            <URLCreateForm credentials={credentials}/>
                        }
                    </div> :
                    <Login setCredentials={updateCredentials}/>
                }
            </div>
        </div>
    )
}

export default App
