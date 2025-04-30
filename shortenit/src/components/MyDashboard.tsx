import {useEffect, useState} from "react"
import {Box, Container} from "@mui/material";
import {APIToken, getPopularUrls, ShortUrl} from "../actions/api.ts";
import {DataGrid, GridColDef} from '@mui/x-data-grid';

interface IMyDashboardProps {
    credentials: APIToken;
}

function MyDashboard({credentials}: IMyDashboardProps) {
    const REFRESH_PERIOD_IN_MS = 60_000;
    const [urls, setUrls] = useState<ShortUrl[]>([]);
    const [lastRefresh, setLastRefresh] = useState<number>(0);

    useEffect(() => {
        const now = new Date();
        //console.log(`last refreshed: ${lastRefresh}, now: ${now.getTime()}, diff: ${now.getTime() - lastRefresh}`);
        if ((now.getTime() - lastRefresh) > REFRESH_PERIOD_IN_MS) {
            //console.log(`refreshing data...`);
            setLastRefresh(now.getTime());
            getPopularUrls(credentials?.token).then(
                result => {
                    //console.log("refreshed: ", result);
                    if ('error' in result) {
                        console.log("error: ", result);
                    } else {
                        setUrls(result.urls);
                    }
                }
            )
        }
    })

    const columns: GridColDef<(ShortUrl[])[number]>[] = [
        {field: 'id', headerName: 'ID', width: 220},
        {
            field: 'visits',
            headerName: 'Visits',
            type: 'number',
            width: 80,
            editable: false,
        },
        {
            field: 'shortUrl',
            headerName: 'Short URL',
            type: 'string',
            width: 300,
            editable: false,
        },
        {
            field: 'url',
            headerName: 'Full URL',
            width: 250,
            editable: false,
        }
    ];

    return <Container maxWidth="lg">
        <div className={"tableTitle"}>Your 10 Most Popular Shortened Links</div>
        <Box sx={{height: 371, width: '100%'}}>
            <DataGrid
                rows={urls}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                // checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    </Container>
}

export default MyDashboard;