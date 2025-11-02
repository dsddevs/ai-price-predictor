import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store/store.tsx";
import {TrendPage} from "./components/pages/trend.page.tsx";
import React from "react";
import {CustomProvider} from "./providers/provider.tsx";

const App: React.FC = () => {

    return (
        <Provider store={store}>
            <CustomProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={"/"} element={<TrendPage/>}/>
                    </Routes>
                </BrowserRouter>
            </CustomProvider>
        </Provider>
    )
}

export default App
