const calcBoundaries = ({axis, data}) => {

    const log10 = (n) => {
        return Math.floor(Math.log10(n)) - 1
    }

    const min = Math.min(...data.map(item => item[axis]), 0)  
    const max = Math.max(...data.map(item => item[axis]), 0) 
    const range = max - min


    if(range) {
        const size = log10(range)   // how many decimals the range has

        const specialTickrange = (range / (10**size)) <= 20 && (range / (10**size)) >= 10
        
        // set the boundaries of Y depending on the tick placement (if itsbetween 1 & 2 values ticks will be different)

        if (specialTickrange) {
            const tickSpacing = 2 * (10**size)                                              // tickspacing will always be a tenfold of 2 in this range
            const upperBoundary = (Math.ceil((max/tickSpacing))*tickSpacing) + tickSpacing       // get the closest uppertick to the max value and add another tick
            const lowerBoundary = (Math.ceil((min/tickSpacing))*tickSpacing) - tickSpacing       // get the closest lowertick to the max value and add another tick
      
            return {
                upperBoundary: upperBoundary,
                lowerBoundary: lowerBoundary,
            }
        } else {
            const tickSpacingPrep = Math.floor((max - min) / 10**(size + 1))                 // tickspacing will change between a tenfold of either 1 or 5
            const tickSpacing = Math.ceil(tickSpacingPrep/5)*(5*10**size)
            const upperBoundary = (Math.ceil((max/tickSpacing))*tickSpacing) + tickSpacing
            const lowerBoundary = (Math.ceil((min/tickSpacing))*tickSpacing) - tickSpacing
           
            return {
                upperBoundary: upperBoundary,
                lowerBoundary: lowerBoundary,
            }
        }
    } else {
        return {
            upperBoundary: 10,
            lowerBoundary: -10,
        }            
    }
}

export default calcBoundaries