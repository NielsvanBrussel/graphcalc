import React, { useState, useRef, useEffect } from 'react'
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'
import styles from '../styles/Selection.module.css'

const Selection = ({ tabs, equation, setEquation, altEquation }) => {

    const [dropdown, setDropdown] = useState(false)
    const wrapperRef = useRef(null);

   const useOutsideAlerter = () => {
        useEffect(() => {
          /**
           * Alert if clicked on outside of element
           */
          function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
              setDropdown(false);
            }
          }
          // Bind the event listener
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [wrapperRef]);
    }

    useOutsideAlerter()



    const selectItem = (item) => {
        setEquation(item)
        setDropdown(false)
    }

    const SelectionItem = ({item}) => {
        return (
            <div className={styles.selection__item__option} onClick={() => selectItem(item)}>
                <div className={styles.formula__colour} style={{ backgroundColor: item.colour }}></div>
                <h3>{item.title} &nbsp; =</h3>
                <h3>{item.formula}</h3>
            </div>
        )
    }

    const options = tabs.filter(item => 
        item.title !== equation?.title && item.title !== altEquation?.title
    )

    console.log(options)


  return (
    <div ref={wrapperRef} className={styles.container}>
        <div className={styles.container__inner}>
        <div className={styles.selection__displaybox} onClick={() => setDropdown(prevState => !prevState)}>
            {equation ? 
                <div className={styles.selection__item__selected}>
                    <div className={styles.selection__item__selected}>
                        <div className={styles.formula__colour} style={{ backgroundColor: equation.colour }}></div>
                        <h3>{equation.title} &nbsp; =</h3>
                        <h3>{equation.formula}</h3>
                    </div>
                    {dropdown ? <MdArrowDropUp size={28}/> : <MdArrowDropDown size={28}/>}
                </div>
            :
                <div className={styles.selection__item__selected}>
                    <h3>select an equation</h3>
                    {dropdown ? <MdArrowDropUp size={28}/> : <MdArrowDropDown size={28}/>}
                </div>
            }
        </div>
        {dropdown &&
        <div className={styles.dropdown__container__outer}>
            <div className={styles.dropdown__container__inner}>
                {options.map(item => 
                    <SelectionItem item={item} key={item.colour} />
                )}
                {options.length === 0 && 
                    <div className={styles.selection__item__option} onClick={() => selectItem("")}>
                        <h3>No equation</h3>
                    </div>
                }
            </div>
        </div>
        }
        </div>
    </div>
  )
}

export default Selection