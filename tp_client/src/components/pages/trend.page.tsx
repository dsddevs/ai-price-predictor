import PanelLeft from "../panels/panel.left.tsx";
import PanelRight from "../panels/panel.right.tsx";
import PanelTop from "../panels/panel.top.tsx";
import {trendPageStl} from "../../styles/stylebox.tsx";
import {Screen} from "../screens/screen.tsx";
import React from "react";

export const TrendPage: React.FC = () => {
    return (
        <section className={`${trendPageStl.base}`}>
            <Screen/>
            <PanelTop/>
            <PanelLeft/>
            <PanelRight/>
        </section>
    )
}
