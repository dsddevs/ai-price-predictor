const flex = {
    injcic: 'inline-flex justify-center items-center',
    ic: 'flex items-center',
    jc: 'flex justify-center',
    x: 'flex flex-row',
    y: 'flex flex-col',
    yic: 'flex flex-col items-center',
    jcic: 'flex justify-center items-center',
    jbic: 'flex justify-between items-center',
    jaic: 'flex justify-around items-center',
    xjcic: 'flex flex-row justify-center items-center',
    xjsic: 'flex flex-row justify-start items-center',
    yjcic: 'flex flex-col justify-center items-center',
}

export const trendPageStl = {
    base: `${flex.y} relative w-full h-screen`,
}
export const panelStl = {
    top: `z-50 absolute top-[4px] w-full h-10 ${flex.xjsic} space-x-[60px] bg-panel`,
    left: `z-50 absolute top-[49px] left-0 w-[45px] h-[100vh] bg-panel`,
    right: `z-50 absolute top-[49.5px] right-0 w-[45px] h-[100vh] bg-panel`
}

export const dragStl = {
    xPos: `absolute inset-y-0 w-[6px] bg-line cursor-col-resize`,
    yPos: `absolute inset-x-0 h-[6px] bg-line cursor-row-resize`
}
export const screenStl = {
    screen: `z-0 relative w-[94.8%] h-[95%] ml-[48px] mt-[49.2px]`,
    left: `z-0 absolute inset-y-0 left-0 text-white`,
    right: `z-0 absolute inset-y-0 right-0 bg-screen text-white`,
    chart: `z-0 absolute ml-[2px] top-0 left-0 right-0 bg-screen text-white`,
    statistics: `z-0 absolute ml-[2px] bottom-0 left-0 right-0 bg-screen text-white`,
}

const dd = {
    mainDiv: `relative ${flex.xjcic} px-2 py-1 w-full rounded-[3px] cursor-pointer bg-transparent`,
    icon: `text-line group-hover:text-white`,
    label: `text-line text-[18px] font-semibold group-hover:text-white`,
    optionDiv: `absolute z-10 text-white font-semibold bg-line border-2 border-yellow-900 rounded shadow-lg`,
    option: `${flex.ic} hover:bg-cursor_line cursor-pointer`
}
export const dropdownStl = {
    base: `relative inline-block`,
    selectionDiv: `${dd.mainDiv} hover:bg-line group`,
    selection: `${flex.ic} overflow-hidden`,
    selectionLabel: `${flex.ic} ${dd.label} ml-1`,
    selectedLabel: `${dd.label} ml-2 flex-shrink-0`,
    icon: `${dd.icon} h-6 w-6`,
    optionLabel: `truncate`,

    rangeDiv: `${dd.mainDiv} hover:bg-line group`,
    rangeIcon: `${dd.icon} h-6 w-6`,
    rangeLabel: `${flex.ic} ml-1 text-line text-[18px] group-hover:text-white`,
    calendarDiv: `${flex.yjcic} w-full h-full hover:bg-line group rounded`,
    calendarBtn: `${dd.label} flex-shrink-0`,
    calendar: `absolute top-12 -left-6`,

    chartSelectedIcon: `${dd.icon} h-[27px] w-6`,
    chartSelectionIcon: `${dd.icon} ml-2 mt-1 h-5 w-5`,
    chartOptionDiv: `${dd.optionDiv} mt-4 -right-8`,
    chartOption: `${dd.option} px-3 py-2`,
    chartOptionIcon: `mr-2 text-[18px]`,

    tickerOptionDiv: `${dd.optionDiv} mt-3 right-2.5`,
    tickerOption: `${dd.option} px-4 py-2 text-[15px]`,

    dayBase: `absolute left-0 inline-block`,
    daySelectDiv: `relative ${flex.xjcic} px-4 py-1 w-full rounded-[3px] cursor-pointer bg-transparent hover:bg-line group`,
    daysIcon: `${dd.icon} h-[18px] w-[18px]`,
    daySelection: `${flex.ic} overflow-hidden`,
    daySelectedLabel: `text-line text-[18px] font-oswald group-hover:text-white ml-2 flex-shrink-0`,
    dayOptionDiv: `${dd.optionDiv} mt-3 text-[15px] left-0 w-[115px]`,
    dayOptionTable: `grid grid-cols-3 gap-1`,
    dayOption: `${flex.ic} px-2 py-1 hover:bg-cursor_line cursor-pointer`,

    langSelectedIcon: `${dd.icon} h-5 w-5`,
    langOptionDiv: `${dd.optionDiv} mt-4 w-20 text-[15px]`,
    langOptionIcon: `mr-2 h-4 w-4`,
}

export const tickerPointsStl = {
    base: `z-50 absolute top-[20px] left-[40px] text-ticker_indicators`,
    indicatorsDiv: `grid grid-cols-4 gap-x-2 text-[15px]`,
    indicators: `grid grid-cols-[auto,1fr] gap-x-2`,
    label: `mr-2 font-semibold`,
    digit: `tabular-nums font-semibold inline-block w-12 text-left`
}

export const forecastBtnStl = {
    btnDiv: `inline-flex items-center cursor-pointer`,
    div: `relative w-9 h-5 bg-gray-200 rounded-full
    peer dark:bg-gray-700 peer-checked:after:translate-x-full
    rtl:peer-checked:after:-translate-x-full peer-checked:after:border-switchOn
    peer-checked:after:bg-switchOn
    after:content-[''] after:absolute after:top-[2px] after:start-[2px]
    after:bg-gray-400 after:border-gray-400 after:border after:rounded-full after:h-4
    after:w-4 after:transition-all
    dark:border-gray-600 peer-checked:bg-line`,
    label: `ms-3 text-[16px] font-semibold text-line`
}

export const statStl = {
    screenBox: `z-0 absolute bottom-0 left-0 right-0 bg-screen text-white
                flex justify-center items-center text-[18px]`,
    screenDiv: `flex flex-col justify-center items-center w-full h-full p-4 select-none`,
    nonScreen: `flex justify-center items-center overflow-y-auto max-h-full w-auto
                font-oswald text-[22px] text-gray-300`,
    base: `flex justify-center items-center w-full h-full`,
    periodLabel: `pl-1 font-antonio bg-header text-line w-40`,
    label: `pl-1 font-antonio w-40 text-gray-300`,
    periodValue: `font-oswald w-32 text-center bg-header text-line`,
    values: `font-oswald w-32 text-center text-gray-300`,
    diffValue: `font-oswald w-32 text-center`
}

export const newsStl = {
    base: `bg-header text-white rounded-lg shadow-md overflow-hidden`,
    img: `w-full h-48 object-cover`,
    title: `text-xl font-bold text-gray-300 mb-2`,
    time: `text-sm text-gray-400 mb-2`,
    descOpen: `text-gray-400 mb-4`,
    descClose: `text-gray-400 mb-4 truncate`,
    btn: `text-blue-600 hover:text-blue-800 transition duration-300`,
    newsDiv: `z-0 absolute inset-y-0 right-0 bg-screen text-white select-none flex flex-col`,
    newsLabel: `z-50 py-1 mt-6 ml-[24px] flex justify-center items-center
                text-[25px] font-oswald bg-header w-[1341px] text-line text-center rounded-t-[5px]`,
    scrollDiv: `flex-1 overflow-y-auto`,
    newsItems: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6`
}
