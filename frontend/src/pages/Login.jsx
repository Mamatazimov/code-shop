import { useState,useRef } from "react";
import './Login.css'
import { ImArrowLeft2,ImArrowRight2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import api from "../api/Api";



function Login(){
    const [isLogged,setIsLogged] = useState("log")
    const navigate = useNavigate();


    const lemailRef = useRef(null);
    const lpasswordRef = useRef(null);

    const remailRef = useRef(null);
    const rpasswordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);


    // login
    const handleSubmitLogin = async (event) => {
        event.preventDefault();



        const email = lemailRef.current.value;
        const password = lpasswordRef.current.value;



        // Form ma'lumotlarini yuborish
        try {
            const response = await api.post("http://127.0.0.1:8000/login", 
                { email:email,password:password }
            );

            const responseData = response.data;
            localStorage.setItem("token",responseData.token);
            localStorage.setItem("refresh",responseData.refresh);
            


            console.log(responseData)
            lemailRef.current.value = "";
            lpasswordRef.current.value = '';
            navigate("/dashboard");
        
        } catch (error) {
            console.error("Tarmoq xatosi:", error);
        }
    }

    //register
    const handleSubmitRegister = async (event) => {
        event.preventDefault();

        const email = remailRef.current.value;
        const password = rpasswordRef.current.value;
        const first_name = firstNameRef.current.value;
        const last_name = lastNameRef.current.value;

        // Form ma'lumotlarini yuborish
        try {
            const response = await fetch("http://127.0.0.1:8000/register", 
                { email:email,password:password,first_name:first_name,last_name:last_name }
            );

                const responseData = response.data;
                localStorage.setItem("token",responseData.token);
                localStorage.setItem("refresh",responseData.refresh);

                console.log(responseData)
                remailRef.current.value = "";
                rpasswordRef.current.value = '';
                firstNameRef.current.value = '';
                lastNameRef.current.value = '';

                navigate("/dashboard");

        } catch (error) {
            console.error("Tarmoq xatosi:", error);
        }
    }

    // message 
    const [isMessage, setIsMessage] = useState(false)
    const [message, setMessage] = useState({})
    function Msg(xabar,color,vaqt){
        setMessage({
        text: xabar,
        color: color,
        })
        setIsMessage(true);
        setTimeout(() => {
            setIsMessage(false)
        }, vaqt)
    }


    if (isLogged==="log"){



        return(
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={handleSubmitLogin} className="loginForm">
                    <input type="email" placeholder="Email" ref={lemailRef} required />
                    <input type="password" placeholder="Parol" ref={lpasswordRef} required />
                    <button type="submit">Login</button>
                </form>
                <button onClick={()=>{setIsLogged("reg")}} className="logChangeBtn" > To Register <ImArrowRight2 /></button>
                <Message message={message} isMessage={isMessage} setIsMessage={setIsMessage} />

            </div>
        );
    }else if(isLogged==="reg"){



        return(
        <div className="register">
            <h1>Register</h1>
                <form onSubmit={handleSubmitRegister} className="loginForm">
                    <input type="email" placeholder="Email" ref={remailRef} required />
                    <input type="password" placeholder="Parol" ref={rpasswordRef} required />
                    <input type="text" placeholder="Ism" ref={firstNameRef} required />
                    <input type="text" placeholder="Familiya" ref={lastNameRef} required />

                    <button type="submit">Register</button>
                </form>
            <button onClick={()=>{setIsLogged("log")}} className="logChangeBtn" > To Login <ImArrowLeft2 /></button>
            <Message message={message} isMessage={isMessage} setIsMessage={setIsMessage} />

        </div>
        );
}
};
export default Login