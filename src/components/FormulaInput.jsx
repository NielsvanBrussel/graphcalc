import React, { useState, useEffect } from 'react'
import styles from '../styles/FormulaInput.module.css'
import { IoCloseOutline, IoWarningOutline } from 'react-icons/io5'
import calcFormulaData from '../utility/calcFormulaData'

const FormulaInput = ({ 
            item, 
            data, 
            setData, 
            tabs, 
            setTabs, 
            topXRange, 
            bottomXRange,        
            rangeIncrement, 
            removeTab, 
            index,
}) => {

    const [formula, setFormula] = useState(item.formula)
    const [errorMessage, setErrorMessage] = useState("")
    const [validFormula, setValidFormula] = useState(true)

    const check = item.formula

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(formula.length > 0 && formula !== check)  {
                calcValues()
            }
        }, 1500)
        
      return () => clearTimeout(delayDebounceFn)
    }, [formula])

 

    const createError = (message) => {
        if (formula.length > 0) {
            setValidFormula(false)            
        }
        setErrorMessage(message)
    }


    const saveFormula = () => {
        const copy = tabs
        const result = copy.map(el => el.colour === item.colour ? {...el, formula: formula} : el);
        setTabs(result)        
    }

    const calcValues = () => {

        saveFormula()

        // check if formula has a valid input
        const validFormula = /^(?=.{1,50}$)(([\dxX^()*\/\-.+π\s]|(?:\b[\d]*?sin\b|\b[\d]*tan\b|\b[\d]*cos\b|\b[\d]*log\b)))*$/ig.test(formula)
        // length between 1-50, symbols between [] (\s = whitespace, \d is any digit, whole words between \b's)
        
        // get a copy of current data and clear old data of this formula
        let dataCopy = data.filter(el => el.graphid !== item.graphid)
        
        if (validFormula) {

            setValidFormula(true)
            setErrorMessage("")

            const newData = calcFormulaData({formula: formula, topXRange: topXRange, bottomXRange: bottomXRange, rangeIncrement: rangeIncrement, item: item, dataCopy: dataCopy})
            if (newData.error) {
                createError(newData.error)
            }
            if (newData.data) {
                console.log(newData)
                setData(newData.data)
            }
         
        } else {
            createError("Invalid formula. Check info for clarification.")
        }     
    }


    return (
      
            <div className={styles.container}>
                <div className={validFormula? (`${styles.formula__container} ${styles.valid}`): (`${styles.formula__container} ${styles.invalid}`)}>
                    <form className={styles.formula__form}>
                        <label className={styles.formula__label}>
                            <div className={styles.label__container}>
                                <div className={styles.formula__colour} style={{ backgroundColor: item.colour }}></div>
                                <p className={styles.label__text}>{item.title} &nbsp; =</p>
                            </div>
                        </label>  
                        <input type="title" autoComplete="off" className={styles.formula__input} value={formula} onChange={(e) => setFormula(e.target.value)} placeholder={"enter formula"}></input>
                    </form>
                    <div className={styles.closebutton__container}>
                        {!validFormula && 
                        <IoWarningOutline size={24} className={styles.errorbutton} title={errorMessage}/>
                        }
                        {tabs.length > 1 && 
                        <IoCloseOutline size={24} className={styles.closebutton} onClick={() => removeTab({index: index, graphid: item.graphid})}/>
                        }                        
                    </div>   
                </div>
        
            </div>

    )
}


export default FormulaInput