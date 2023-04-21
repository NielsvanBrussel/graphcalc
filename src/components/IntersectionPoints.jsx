import React from 'react'
import nerdamer from "nerdamer/all.js";

const IntersectionPoints = ({formulaA, formulaB}) => {
    const intersect = (f1, f2) => {
        try {
          var x = nerdamer.solve(f1+"="+f2, "x");
  
          // form array
          let array = x.toString().replaceAll(/\[|\]/g, '').split(",")

          // clear imaginary numbers
          const intersections = array.filter(item => !item.includes('i'))

          return(intersections);  //outputs [0,1,-1]
        } catch (error) {
          return ([])
        }
      }

      const intersections = intersect(formulaA, formulaB)


      return (
        <div style={{ margin: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'top', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {intersections.length > 0 ? 
              <>
                { intersections.map((point, index) => {

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

                          console.log(convertedFormula)

                  // fill in x
                  const insertX = convertedFormula.replaceAll(/x|X/g, point)

                  // calculate the x & y and round down to 2 decimals
                  const valueY = Math.round((eval(insertX)) * 100) / 100
                  const valueX = Math.round((eval(point)) * 100) / 100

                  return (
                        <div key={index} style={{ margin: '1rem' }}>    
                            <h4>Intersection {index + 1}.</h4>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
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
        </div>
      )
}

export default IntersectionPoints