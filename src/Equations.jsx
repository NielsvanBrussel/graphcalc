import React, { useState, useRef, useEffect } from 'react'
import createLineChartSvg from './d3/createLineChart'
import * as d3 from 'd3'
import { v4 as uuidv4 } from 'uuid';
import styles from './styles/Equations.module.css'
import { MdAddBox } from 'react-icons/md'
import { BsInfoLg } from 'react-icons/bs'
import InputField from './components/InputField';
import FormulaInput from './components/FormulaInput';
import Intersections from './components/Intersections';
import calcFormulaData from './utility/calcFormulaData';
import MinMax from './components/MinMax';

const Equations = () => {

    const tabid = uuidv4()
    const lineChartRef = useRef()


    // available tabs
    const [tabData, setTabData] = useState([
        {colour: '#68c479', title: 'f(x)', formula: ''},
        {colour: '#962ce8', title: 'g(x)', formula: ''}, 
        {colour: '#7f1f13', title: 'h(x)', formula: ''}, 
        {colour: '#17cbd4', title: 'k(x)', formula: ''}, 
        {colour: '#675104', title: 'p(x)', formula: ''}, 
        {colour: '#ea990c', title: 'r(x)', formula: ''}
    ])

    // active tabs
    const [tabs, setTabs] = useState([{graphid: tabid, colour: tabData[0].colour, title: tabData[0].title, formula: tabData[0].formula}])

    // data for the graphs
    const [data, setData] = useState([])

    // range of the x values & incrementation
    const [topXRange, setTopXRange] = useState(10)
    const [bottomXRange, setBottomXRange] = useState(-10)
    const [rangeIncrement, setRangeIncrement] = useState(1)

    // state to trigger recalculation after range/incr changes 
    const [recalculateCheck, setRecalculateCheck] = useState(false)

    // show info on hover

    const [showInfo, setShowInfo] = useState(false)


    // recalculate all new values of each equation when range/incr changes
    const recalculateGraphs = () => {
        let newData = []
        tabs.map(item => {
            if (item.formula) {
                let dataCopy = []
                const values = calcFormulaData({formula: item.formula, topXRange: topXRange, bottomXRange: bottomXRange, rangeIncrement: rangeIncrement, item: item, dataCopy: dataCopy})
                newData = newData.concat(values.data)          
            }
        })
        setData(newData)
    }


    // trigger recalculation after user stops changing range/incr
    useEffect(() => {

        if (recalculateCheck) {
            const delayDebounceFn = setTimeout(() => {
                recalculateGraphs()
            }, 1500)
            
            return () => clearTimeout(delayDebounceFn)
        } else {
            setRecalculateCheck(true)
        }
        
    }, [rangeIncrement, bottomXRange, topXRange])


    // draw the graph
    useEffect(() => {

        // remove old svg
        const svg = d3.select(lineChartRef.current)
        svg.selectAll("*").remove()

        // create new one
        createLineChartSvg({
            lineChartRef: lineChartRef,
            rawData: data,
            xAxisUnit: "x",
            yAxisUnit: "y",
            autoSort: false,
            tabs: tabs,
        })   

    }, [data, tabs])

    
    // add a new equation
    const createTab = () => {
        setTabs([...tabs, {graphid: uuidv4(), colour: tabData[tabs.length].colour, title:  tabData[tabs.length].title, formula: tabData[tabs.length].formula}])
    }

    // remove an equation
    const removeTab = ({index, graphid}) => {
        const filteredData = data.filter(item => item.graphid !== graphid)
        setData(filteredData)

        let copyTabData = [...tabData]
        copyTabData.push(copyTabData.splice(index, 1)[0])
        setTabData(copyTabData)

        const copy = [...tabs]
        copy.splice(index, 1)
        setTabs(copy)
    }

    return (
        <section style={{ width: '100%', margin: '3rem auto', maxWidth: '80rem'}}>
            <div style={{margin: '2rem 4vw'}}>
                <div style={{ margin: '2rem auto',  backgroundColor: '#191F45'}}>
                    <svg style={{clear: "both"}} ref={lineChartRef}></svg> 
                </div>
                <div>
                <div className={styles.formula__controls__container__inputs}>
                        <div className={styles.input__container}>
                            <InputField 
                                label="min X value"
                                value={bottomXRange}
                                setValue={setBottomXRange}
                                placeholder="enter the minimum value of X"
                                variant='inverted'
                            />
                        </div>
                        <div className={styles.input__container}>
                            <InputField 
                                label="max X value"
                                value={topXRange}
                                setValue={setTopXRange}
                                placeholder="enter the maximum value of X"
                                variant='inverted'
                            />
                        </div>
                        <div className={styles.input__container}>
                            <InputField 
                                label="incrementation"
                                value={rangeIncrement}
                                setValue={setRangeIncrement}
                                placeholder="enter Y unit"
                                variant='inverted'
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.section__container}>
                    <div className={styles.section__content}>
                        <div className={styles.section__info__button__container}>
                            <BsInfoLg onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} className={styles.info__button} size={40}/>
                        </div>
                        { showInfo && 
                            <div className={styles.section__info__container}>
                                <h3>accepted operators</h3>
                                <p>*,&nbsp; /,&nbsp; +,&nbsp; -,&nbsp; ^,&nbsp; sin(),&nbsp; cos(),&nbsp; tan(),&nbsp; log()</p>
                                <h3>examples</h3>
                                <p>f(x) = 2x + 5x^2 -3 &nbsp; (* operator is allowed to be omitted in front of x)</p>
                                <p>f(x) = sin(x) / cos(x+2)</p>
                                <p>f(x) = x^(-1/2) &nbsp; (for root calculations use the ^(-1/2) notation)</p>
                                <p>f(x) = 2x + sin(π) &nbsp; </p>
                                <h3>if you receive an error try adding/checking brackets!</h3>
                                <h3>imaginary numbers will not be calculated</h3>
                            </div>
                        }
                        <div className={styles.section__header__container}>
                            <h1 className={styles.section__header}>Equations</h1>
                        </div>
                        {tabs.map((item, index) => 
                          <FormulaInput 
                            item={item}
                            key={item.colour} 
                            data={data} 
                            setData={setData} 
                            tabs={tabs} 
                            setTabs={setTabs} 
                            topXRange={topXRange} 
                            bottomXRange={bottomXRange} 
                            rangeIncrement={rangeIncrement}
                            removeTab={removeTab}
                            index={index}
                          />
                        )}
                        {tabs.length < 6 && 
                            <div className={styles.formula__input__add__outer} >
                                <div className={styles.formula__input__add__inner}>
                                    <MdAddBox onClick={createTab} size={42} className={styles.formula__input__add__icon} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {tabs.length > 0 && 
                    <MinMax tabs={tabs}/>          
                }
                {tabs.length > 1 && 
                    <Intersections tabs={tabs}/>          
                }
            </div>
        </section>
    )
}

export default Equations