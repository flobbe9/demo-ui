import React from 'react'
import { BACKEND_BASE_URL } from '../utils/GlobalVariables'



export default function Login(props) {

    return (
        <div>
            <h2>Login</h2>
        
            <body>
                <div className="container">
                    <form className="form-signin" method="post" action={BACKEND_BASE_URL + "/api/user/login"}>
                        <h2 className="form-signin-heading">Please sign innn</h2>
                        <p>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input type="text" id="username" name="username" className="form-control" placeholder="Username" required autoFocus />
                        </p>
                        <p>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input type="password" id="password" name="password" className="form-control" placeholder="Password" required />
                        </p>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    </form>
                </div>
            </body>
        </div>
    );
}