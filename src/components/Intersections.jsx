import React, { useState, useEffect } from 'react'
import Selection from './Selection'
import styles from '../styles/Intersections.module.css'
import { TbArrowsCross } from 'react-icons/tb'
import IntersectionPoints from './IntersectionPoints'


const Intersections = ({ tabs }) => {

  const [selectedA, setSelectedA] = useState()
  const [selectedB, setSelectedB] = useState()

  useEffect(() => {

    // reset when a formula changes
    setSelectedA()
    setSelectedB()
  }, [tabs])
  


  return(
    <div className={styles.section__container}>
      <div className={styles.section__content}>
        <div className={styles.section__header__container}>
          <h1 className={styles.section__header}>Intersections</h1>
        </div>
        <div className={styles.selection__container}>
            <Selection setEquation={setSelectedA} equation={selectedA} altEquation={selectedB} tabs={tabs}/>
            <div className={styles.iconbox}> 
              <TbArrowsCross size={24}/>
            </div>
            <Selection setEquation={setSelectedB} equation={selectedB} altEquation={selectedA} tabs={tabs}/>          
        </div>
        {(selectedA?.formula && selectedB?.formula) ?
        <IntersectionPoints formulaA={selectedA.formula} formulaB={selectedB.formula}/>
        :
        (selectedA && selectedB) && <h4>Please fill in all formulas.</h4>
        }
      </div>
    </div>  
  )

   
}

export default Intersections