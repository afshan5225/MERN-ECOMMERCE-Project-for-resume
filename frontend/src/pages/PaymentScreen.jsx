import React, { useEffect, useState } from 'react'
import {Form , Button, Col, FormCheck } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../slices/cartSlice'




CheckoutSteps

const PaymentScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const[PaymentMethod,setPaymentMethod] = useState('PayPal');

    const cart= useSelector((state)=>state.cart)
    const {shippingAddress} = cart;

    useEffect(()=>{
        if(!shippingAddress){
            navigate("/shipping ")
        }
    },[shippingAddress,navigate])

    const submitHandler=(e)=>{

        e.preventDefault()
        dispatch(savePaymentMethod({PaymentMethod}))
        navigate("/placeorder")
        
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>  
        <h1>Payment Method</h1> 
        <Form onClick={submitHandler}>
            <Form.Group>
                <Form.Label as ='legend'>Select Method</Form.Label>
                 <Col>
                <FormCheck
                type='radio'
                className='my-2'
                label ='PayPal or Credit Card'
                id="Paypal"
                name="PaymentMethod"
                value='Paypal'
                checked
                onChange={(e)=>setPaymentMethod(e.target.value)}></FormCheck>
            </Col>
            </Form.Group>
            <Button type="submit" varient='primary'>
                Continue
            </Button>
           
        </Form>
     </FormContainer>
  )
}

export default PaymentScreen