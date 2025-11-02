import {panelStl} from "../../styles/stylebox.tsx";
import {ChartDd} from "../dropdowns/dd/chart.dd.tsx";
import {TickerDd} from "../dropdowns/dd/ticker.dd.tsx";
import React from "react";
import {StartedDateDD} from "../dropdowns/dd/started.date.dd.tsx";
import {EndedDateDd} from "../dropdowns/dd/ended.date.dd.tsx";
import {LangDd} from "../dropdowns/dd/lang.dd.tsx";


const PanelTop: React.FC = () => {

    return (
        <section className={`${panelStl.top} select-none`}>
            <img className={`ml-8 w-8 h-8`} src={`src/assets/logo.ico`} alt={`logo`}/>
            <ChartDd/>
            <TickerDd/>
            <StartedDateDD/>
            <EndedDateDd/>
            <LangDd/>
        </section>
    )
}
export default PanelTop
