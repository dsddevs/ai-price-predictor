import React from "react";
import {CircularProgress, Stack} from "@mui/material";

export const Loader: React.FC = () => {
    return (
        <div className="loader flex justify-center items-center overflow-x-auto h-full max-w-screen">
            <Stack sx={{ color: '#b26d35' }} spacing={2} direction="row">
                <CircularProgress color="inherit"/>
            </Stack>
        </div>
    )
}
