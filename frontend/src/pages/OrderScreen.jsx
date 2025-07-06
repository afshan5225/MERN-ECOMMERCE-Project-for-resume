import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";


import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from "../slices/ordersapiSlice.js";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";


const OrderScreen = () => {
  const {id:orderId} = useParams()

  const{data:order,refetch,isLoading,error} = useGetOrderDetailsQuery(orderId);
  const[payOrder,{isLoading:loadingPay}] = usePayOrderMutation();
  const [{isPending},paypalDispatch] = usePayPalScriptReducer();

  const{userInfo} = useSelector((state)=>state.auth);

  const {data:paypal,isLoading:loadingPayPal,error:errorpayPal} = useGetPayPalClientIdQuery();

  const[deliverOrder,{isLoading:LoadindDeliver}] = useDeliverOrderMutation();

  const deliverOrderHandler = async()=>{
    try {
      await deliverOrder(orderId)
      refetch();
      toast.success('Order delivered')
      
    } catch (error) {

      toast.error(err?.data?.message||err.message)
      
    }
  }



  useEffect(()=>{

    if(!errorpayPal&&!loadingPayPal&&paypal.clientId){

      const loadPayPalScript = async()=>{
        paypalDispatch({
          type:'resetOptions',
          value:{
            'clientId':paypal.clientId,
            currency:'USD'
          }
        })
        paypalDispatch({
          type:'setLoadingStatus',
          value:'pending'
        });
      }
      if(!errorpayPal && !loadingPayPal && paypal?.clientId && order && !order.isPaid){
          console.log("PayPal Client ID:", paypal?.clientId);
        if(!window.paypal){
          loadPayPalScript();
        }
      }


    }

  },[order,paypal,paypalDispatch,loadingPayPal,errorpayPal])



  

  const onApprove=(data,actions)=>{


    return actions.order.capture().then(async function (details){
      try {
        await payOrder({orderId,details})
        refetch();
        toast.success('Payment Successfull')
      } catch (error) {

        toast.error(err?.data?.message || err.message)
        
      }
    })

    

  }

  const onApproveTest=async ()=>{
    await payOrder({orderId,details:{payer:{}}})
        refetch();
        toast.success('Payment Successfull')
  }

  const onError =(err)=>{
    toast.error(err.message)
  }
  const createOrder=(data,actions)=>{

    return actions.order.create({
      purchase_units:[
        {
          amount:{
            value:order.totalPrice.toFixed(2),
           
          }
        }
      ]
    }).then((orderId)=>{
      return orderId;
    })

  }






  return isLoading?<Loader/>:error?<Message variant ='danger'/>:(

    <>
    <h1>Order {order._id}</h1>
    <Row>
      <Col md={8}>
      <ListGroup variant= 'flush'>
        <ListGroup.Item>
          <h2>Shipping</h2>
          <p>
            <strong>
              Name:
            </strong>
            {order.user.name}
          </p>
          <p>
            <strong>
              Email:
            </strong>
            {order.user.email}
          </p>
          <p>
            <strong>
              Address:
            </strong>
            {order.shippingAddress.address},{order.shippingAddress.city}{order.shippingAddress.postalCode},{
              order.shippingAddress.country}
          </p>
          {order.isDelivered?(
            <Message variant ='Success'>
              Delivered on {order.deliveredAt}
            </Message>
          ):<Message variant ='danger'>Not delivered</Message>}
        </ListGroup.Item>
        <ListGroup.Item>
          <h2>Payment Method</h2>
          <p>
            <strong>Method:</strong>
            {order.paymentMethod}
          </p>
          {order.isPaid?(
            <Message variant='Success'>
              paid on {order.paidAt}
            </Message>
          ):(<Message variant="danger">Not Paid</Message>)}
        </ListGroup.Item>
        <ListGroup.Item>
          <h2>Order Items</h2>
          {order.orderItems.map((items,index)=>(
            <ListGroup.Item key={index}>

              <Row>
                <Col md={1}>
                <Image src={items.image} alt={items.name} fluid round />
                </Col>
                <Col>
                <Link to={`/product/${items.product}`}>
                  {items.name}
                </Link>

                </Col>
                <Col md={4}>
                {items.qty}x₹{items.price}=₹{items.qty*items.price}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}

        </ListGroup.Item>
      </ListGroup>
      </Col>
      <Col md={4}>
      <Card>
        <ListGroup variant ='flush'>
          <ListGroup.Item>
            <h2>Order Summary</h2>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Items</Col>
              <Col>₹{order.itemsPrice}</Col>
            </Row>

            <Row>
              <Col>Shipping</Col>
              <Col>₹{order.shippingPrice}</Col>
            </Row>

            <Row>
              <Col>Tax</Col>
              <Col>₹{order.taxPrice}</Col>
            </Row>
            
            <Row>
              <Col>Total</Col>
              <Col>₹{order.totalPrice}</Col>
            </Row>
          </ListGroup.Item>
           {!order.isPaid &&(
            <ListGroup.Item>
              {loadingPay&&<Loader/>}
              {isPending?<Loader/>:(
                <div>
                  <Button onClick={onApproveTest} style ={{marginBottom:'10px'}}>Test pay order</Button>
                  <div>
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                  </div>
                </div>
              )}
            </ListGroup.Item>
           )}
           {LoadindDeliver&&<Loader/>}

           {userInfo&&userInfo.isAdmin &&order.isPaid && !order.isDelivered&&(
            <ListGroup.Item>
              <Button type ='button' className="btn btn-block" onClick={deliverOrderHandler}>
                Mark as delivered
              </Button>
            </ListGroup.Item>
           )}
         
        </ListGroup>
      </Card>
      </Col>
    </Row>
    </>

  )
};

export default OrderScreen;
