import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { AutoSizer, List } from 'react-virtualized';

const ViewAvailability = () => {
    // const [data, setData] = useState([]);
    const [data, setData] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rowsCount, setRowsCount] = useState(0);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8082/doctor/getAvailability', {
                mobileNumber: sessionStorage.getItem('mobileNumber')
            });

            setData(response.data);

            let count = 0;

            for (const outerKey in response.data) {
                if (response.data.hasOwnProperty(outerKey)) {
                    const innerMap = response.data[outerKey];
                    count += Object.keys(innerMap).length;
                }
            }

            setRowsCount(count);

            console.log("Count : " + count);

            console.log(response.data);

        } catch (error) {
            // Handle error response
            // console.error(error);
            setAlertMessage('Failed to Fetch availabilities.');
            setShowSnackbar(true);
        }
    };

    const sortDates = () => {
        return Object.entries(data)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));
    };

    const sortTimes = (index) => {
        if (typeof data[index] === 'object' && data[index] !== null) {
            const sortedTimes = Object.entries(data[index])
                .sort((a, b) => new Date(`1970-01-01 ${a[0]}`) - new Date(`1970-01-01 ${b[0]}`))
                .map(([time]) => time);

            return sortedTimes;
        }

        return [];
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Time Slot</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {Object.entries(data).map(([key, subData]) => (
                        Object.entries(subData).map(([subKey, value]) => (
                            <TableRow key={`${key}-${subKey}`}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{subKey}</TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))
                    ))} */}
                        {sortDates().map(([date, subData]) =>
                            sortTimes(date).map((time) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={`${date}-${time}`}>
                                        <TableCell style={{ color: '#1976D2' }}>{date}</TableCell>
                                        <TableCell style={{ color: '#1B9C85' }}>{time}</TableCell>
                                        {/* <TableCell>{data[date][time]}</TableCell> */}
                                        <TableCell>
                                            {(() => {
                                                if (data[date][time] === 'vacant') {
                                                    return <span style={{ color: '#388E3C' }}>Vacant</span>
                                                }
                                                else {
                                                    return <span style={{ color: '#F44336' }}>Occupied</span>
                                                }
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )
                                )
                        )}
                    </TableBody>
                </Table>
                <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <MuiAlert onClose={handleSnackbarClose} severity="error" variant="filled">
                        {alertMessage}
                    </MuiAlert>
                </Snackbar>
            </TableContainer>
            {/* {console.log("Count : " + count)} */}
            {/* <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rowsCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            {rowsCount < 1 && <p>No Availabilities Added</p>}
        </Paper>
    );

    // return (
    //     <div>
    //         {(() => {
    //             if (data.length > 0) {
    //                 return (
    //                     <AutoSizer>
    //                         {({ width, height }) => (
    //                             <List
    //                                 width={width}
    //                                 height={height}
    //                                 rowCount={data.length}
    //                                 rowHeight={50} // Set the desired row height
    //                                 rowRenderer={({ index, key, style }) => {
    //                                     const rowData = data[index];
    //                                     return (
    //                                         <div key={key} style={style}>
    //                                             <TableCell>{rowData.key}</TableCell>
    //                                             <TableCell>{rowData.subKey}</TableCell>
    //                                             <TableCell>{rowData.value}</TableCell>
    //                                         </div>
    //                                     );
    //                                 }}
    //                             />
    //                         )}
    //                     </AutoSizer>
    //                 );
    //             }
    //             else {
    //                 return (
    //                     <Typography variant="h6" component="h1">
    //                         No Availability Found
    //                     </Typography>
    //                 );
    //             }
    //         })()}
    //     </div>
    // );
};

export default ViewAvailability;
