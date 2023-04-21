const calcFormulaData = ({formula, topXRange,bottomXRange, rangeIncrement, item, dataCopy}) => {


    try {
        // replace 2x, 5x, etc with 2 * x, 5 * x, etc
        let convertedFormulaInit = formula.toLowerCase()
        for (let index = 0; index < 10; index++) {
            convertedFormulaInit = convertedFormulaInit
                                    .replaceAll(`${index}x`, `${index} * x`)
                                    .replaceAll(`${index}c`, `${index} * c`)
                                    .replaceAll(`${index}s`, `${index} * s`)
                                    .replaceAll(`${index}t`, `${index} * t`)
                                    .replaceAll(`${index}l`, `${index} * l`)
                                    .replaceAll(`${index}π`, `${index} * π`)
        }

        // replace the others
        const convertedFormula = convertedFormulaInit
                                    .replaceAll('^', '**')
                                    .replaceAll('x', '(x)')      // brackets to counter errors with negative numbers
                                    .replaceAll('sin', 'Math.sin')
                                    .replaceAll('cos', 'Math.cos')
                                    .replaceAll('tan', 'Math.tan')
                                    .replaceAll('log', 'Math.log')
                                    .replaceAll(/π/g, 'Math.PI')

                                    console.log(convertedFormula)

        // custom loop, Math functions to counter infinite loop errors
        for (let valueX = Math.min(bottomXRange, topXRange); valueX <= Math.max(bottomXRange, topXRange); valueX += Math.abs(rangeIncrement)) {
            try {
                // fill in x
                const insertX = convertedFormula.replaceAll(/x|X/g, valueX)

                // calculate the y
                const valueY = eval(insertX)

                // push the data only if values exist (for example: no square roots of negative numbers)
                if ((valueX && valueY) || (valueX && (valueY === 0)) || ((valueX === 0) && valueY) || (valueX === 0 && valueY === 0)) {              
                    dataCopy.push({x: valueX, y: valueY, id: item.graphid, graphid: item.graphid, colour: item.colour})                        
                }
            } catch (error) {
                return {data : [], error: "Error calculating values. Please check formula."}                 
            }
        }
        return { data: dataCopy, error: null }         
    } catch (error) {
        return {data : [], error: "Error calculating values. Please check formula."}
    }

                
}


export default calcFormulaData