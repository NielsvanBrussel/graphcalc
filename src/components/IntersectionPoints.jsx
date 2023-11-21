import React, { useState } from 'react'
import nerdamer from "nerdamer/all.js";
import styles from '../styles/MinMax.module.css'

const IntersectionPoints = ({formulaA, formulaB}) => {

    const [error, setError] = useState(false)

    const intersect = (f1, f2) => {
        try {
          var x = nerdamer.solve(f1+"="+f2, "x");
  
          // form array
          let array = x.toString().replaceAll(/\[|\]/g, '').split(",")

          // clear imaginary numbers
          const intersections = array.filter(item => !item.includes('i'))

          return(intersections);  //outputs [0,1,-1]
        } catch (err) {
          setError(true)
          return ([])
        }
      }

      const intersections = intersect(formulaA, formulaB)

      // prep the formula

      // replace 2x, 5x, etc with 2 * x, 5 * x, etc
      let convertedFormulaInit = formulaA.toLowerCase()
      for (let index = 0; index < 10; index++) {
        convertedFormulaInit = convertedFormulaInit
                                .replaceAll(`${index}x`, `${index} * x`)
                                .replaceAll(`${index}c`, `${index} * c`)
                                .replaceAll(`${index}s`, `${index} * s`)
                                .replaceAll(`${index}t`, `${index} * t`)
                                .replaceAll(`${index}l`, `${index} * l`)
                                .replaceAll(`${index}π`, `${index} * π`)
      }

      const convertedFormula = convertedFormulaInit
              .replaceAll('^', '**')
              .replaceAll('x', '(x)')     // for cases like x^2 and negative x values
              .replaceAll('sin', 'Math.sin')
              .replaceAll('cos', 'Math.cos')
              .replaceAll('tan', 'Math.tan')
              .replaceAll('log', 'Math.log')
              .replaceAll(/π/g, 'Math.PI')


      return (
      
          <div className={styles.points__flexbox} style={{ marginTop: '2rem'}}>
            {(intersections.length > 0 && !error)? 
              <>
                { intersections.map((point, index) => {

                  let valueX
                  let valueY

                  try {
                    // fill in x
                    const insertX = convertedFormula.replaceAll(/x|X/g, point)

                    // calculate the x & y and round down to 2 decimals
                    valueY = Math.round((eval(insertX)) * 100) / 100
                    valueX = Math.round((eval(point)) * 100) / 100
                  } catch (err) {
                    setError(true)
                  }

                  return (
                        <div key={index} className={styles.point__container__outer}> 
                          <div className={styles.point__container__inner}>
                            <h4>Intersection {index + 1}.</h4>
                            <p>X: {valueX}</p>
                            <p>Y: {valueY}</p>
                          </div>
                        </div>
                  )
                })}
              </>
              :
              <div>
                no intersections
              </div>
            }
          </div>
   
      )
}

export default IntersectionPoints