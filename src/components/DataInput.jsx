import React, { useState, useEffect } from 'react'
import { TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../styles/DataInput.module.css'
import InputField from './InputField';

const DataInput = ({setData, data, removeDataInput, item, active}) => {

    const [xValue, setXValue] = useState(item.x)
    const [yValue, setYValue] = useState(item.y)

    const id = item.id

    useEffect(() => {
        setTimeout(() => {
           updateData()
        }, 200);
    }, [xValue, yValue]) 
    

    const updateData = () => {
        const copy = data
        const result = copy.map(el => el.id === id ? {...el, x: xValue, y: yValue} : el);
        setData(result)
    }

  return (
    <div className={active ? styles.data__input__container__active : styles.data__input__container__inactive}>
        <InputField 
            label="X-value"
            value={xValue}
            setValue={setXValue}
            placeholder="enter X value"
            variant='inverted'
        />
        <InputField 
            label="Y-value"
            value={yValue}
            setValue={setYValue}
            placeholder="enter Y value"
            variant='inverted'
        />
        <IconButton size='small' onClick={() => removeDataInput(id)} aria-label="delete">
            <DeleteIcon />
        </IconButton>
    </div>
  )
}

export default DataInput