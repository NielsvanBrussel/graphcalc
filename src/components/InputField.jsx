import React from 'react'
import styles from '../styles/InputField.module.css'


const InputField = ({ label, value, setValue, placeholder, variant }) => {

  switch (variant) {
    case 'inverted':
      return (
          <div className={`${styles.container} ${styles.inverted}`}>
              <form className={styles.form}>
                <label className={styles.label}>{label}</label>  
                <input className={styles.input} type="title" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}></input>
              </form>
          </div>
      )  
    default:
      return (
        <div className={`${styles.container} ${styles.default}`}>
            <form className={styles.form}>
              <label className={styles.label}>{label}</label>  
              <input className={styles.input} type="title" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}></input>
            </form>
        </div>
      )
  }
}

export default InputField