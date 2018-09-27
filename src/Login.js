import React from 'react'



import './Login.css';



export default function Login(props) {

    return (

        <div className="login-page">

            <div className="form">

                <form onSubmit={props.submit} className="login-form">

                    <input data-testid="firstName" type="text" 
                    placeholder="First Name" onChange={props.input} 
                    autoComplete="First name" />

                    <input data-testid="lastName" type="text" 
                    placeholder="Last Name" 
                    autoComplete="Last name"/>

                    <input data-testid="email" type="text" 
                    placeholder="Email" 
                    autoComplete="Email"/>

                    <input data-testid="password" type="password" 
                    placeholder="password" 
                    autoComplete="current-password"/>

                    <button data-testid="submit">login</button>

                </form>

            </div>

        </div>

    )

}