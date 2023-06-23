import React, { useState, useEffect } from 'react'
import Selection from './Selection'
import styles from '../styles/MinMax.module.css'
import nerdamer from "nerdamer/all.js";



const MinMax = ({ tabs }) => {

  const [selectedEq, setSelectedEq] = useState()
  const [firstDerivative, setFirstDerivative] = useState("")
  const [secondDerivative, setSecondDerivative] = useState("")
  const [minMaxPoints, setMinMaxPoints] = useState([])

  const firstString = ' \' '
  const secondString = ' \' \' '


  useEffect(() => {
    // reset when a formula changes
    setSelectedEq()
  }, [tabs])

  useEffect(() => {
    calcMinMax()
  }, [selectedEq])


  const calcMinMax = () => {
    try {

        // calc derivatives
        const x1 = nerdamer(`diff(${selectedEq.formula}, x)`).toString();
        const x2 = nerdamer(`diff(${selectedEq.formula}, x, 2)`).toString();
        setFirstDerivative(x1)
        setSecondDerivative(x2)

        // calc x values of crit numbers and their y values
        const critNumbers = nerdamer.solveEquations(`${x1}=0`,'x');
        const xValues = critNumbers.toString().replaceAll(/\[|\]/g, '').split(",")

        let valuesArray = []
        xValues.forEach(x => {
            if (x) {

                const y = nerdamer(selectedEq.formula, {x: x}).evaluate().text();
                const minOrMax = nerdamer(x2, {x: x}, 'numer').evaluate();
                let max
                if (minOrMax.lt('0')) {
                  max = true
                } else if (minOrMax.gt('0')) {
                  max = false
                }
                const item = {x: x, y: y, max: max}
                valuesArray.push(item)                
            }
        });
        setMinMaxPoints(valuesArray)
    } catch (error) {
        setMinMaxPoints([])
    }
  }


  function insertBeforeLastOccurrence(strToSearch, strToInsert) {
    var n = strToSearch.lastIndexOf('(');
    return strToSearch.substring(0,n) + strToInsert + strToSearch.substring(n);    
}

  return(
    <div className={styles.section__container}>
      <div className={styles.section__content}>
        <div className={styles.section__header__container}>
          <h1 className={styles.section__header}>Min/Max</h1>
        </div>
        <div className={styles.selection__container}>
            <Selection setEquation={setSelectedEq} equation={selectedEq} altEquation={null} tabs={tabs}/>        
        </div>
        {firstDerivative && selectedEq &&
        <div style={{ textAlign: 'left', margin: '1rem' }}>
            <p style={{ fontSize: '1.5rem'}}>{insertBeforeLastOccurrence(selectedEq.title, firstString)} = &nbsp;{firstDerivative}</p>
            <p style={{ fontSize: '1.5rem'}}>{insertBeforeLastOccurrence(selectedEq.title, secondString)} = &nbsp;{secondDerivative}</p>
        </div>
        }
        {(minMaxPoints.length > 0 && selectedEq) ?
            <div className={styles.points__flexbox}>
                {minMaxPoints.map((point, index) => {
                    return (
                        <div key={index} className={styles.point__container__outer}>    
                            <div className={styles.point__container__inner}>
                                <h4>{index + 1}.</h4>
                                {point.max === true && <p>maximum</p>}
                                {point.max === false && <p>minimum</p>}
                                <p>X: {point.x}</p>
                                <p>Y: {point.y}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            :
            selectedEq && <div>No minimum or maximum found.</div>
        }
      </div>
    </div>  
  )

   
}

export default MinMax