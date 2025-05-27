import { useNavigate } from "react-router-dom";
import { useEffect,useState,useRef } from "react";
import axios from "axios";
import { FaRegCopy,FaAngleDown,FaAngleRight } from "react-icons/fa";
import Modal from "../components/Modal";


function Dashboard() {
    const [load, setLoad] = useState(true);
    const navigate = useNavigate();

    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [email,setEmail] = useState("");

    const [data,setData] = useState([]);

    
    useEffect(() => {
        // Tokenni tekshirish
        if(!localStorage.getItem("token")){
        navigate("/login");
        }else{
            setLoad(false);
        }
        // User ma'lumotlarini olish
        axios.get("http://127.0.0.1:8000/users/me",{
            headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}
        }).then(response => {
            console.log(response.data);
            localStorage.setItem("role",response.data.role);

            setFname(response.data.first_name);
            setLname(response.data.last_name);
            setEmail(response.data.email);
        }).catch(error => {
            console.log(error);
            navigate("/login");
        })
        // User codelarini olish
        axios.get("http://127.0.0.1:8000/products/my",{
            headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}
        }).then(response => {
            console.log(response.data);
            setData(response.data);
            setLoad(false)
        }).catch(error => {
            console.log(error);
        })

    },[navigate])


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        navigate("/login")
    };
    console.log(localStorage.getItem("token"))

    const [openCode,setOpenCode] = useState([]);
    const addremCodeId = (newItem) => {
        if (!openCode.includes(newItem)) { // open
        setOpenCode([...openCode, newItem]);
        }else if(openCode.includes(newItem)){ // close
        setOpenCode(openCode.filter(item => item !== newItem));
        }
    };

    // modal
    const [modalOpen, setModalOpen] = useState(false);

    const changeModal = () => {
        setModalOpen(!modalOpen);
    }

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const first_name = firstNameRef.current.value;
        const last_name = lastNameRef.current.value;

        console.log(email,password,first_name,last_name)


        try {
            const response = await fetch("http://127.0.0.1:8000/users/edit/myself", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ email,password,first_name,last_name }),
            });

            if (response.ok) {
                const responseData = await response.json();

                console.log(responseData)
                emailRef.current.value = "";
                passwordRef.current.value = '';
                firstNameRef.current.value = '';
                lastNameRef.current.value = '';

            } else {
                console.error("Formni jo'natishda xatolik yuz berdi.");
                Msg("Xatolik yuz berdi!","red",5000)
            }
        } catch (error) {
            console.error("Tarmoq xatosi:", error);
        }

        changeModal();
    }

    



    
  if(load) return <h3>Yuklanyabdi...</h3>;

  return (
    <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="mainDashboard" style={{
            display:"grid",
            width:"100%",textAlign:"start",borderRadius:"1rem",
            boxShadow:"0 0 1rem rgba(0,0,0,0.5)",padding:"1rem"
        }}>

            <div className="userData">
                <h2 style={{textAlign:"center"}}>User malumotlari</h2>
                <h3>Ism: {fname}</h3>
                <h3>Familiya: {lname}</h3>
                <h3>Email: {email}</h3>

            <button onClick={() => changeModal()} style={{borderColor:"#646cff",marginRight:"1rem"}} >Edit</button>
            <button style={{borderColor:"red"}} onClick={logout}>Logout</button>

            </div>
            <div className="userCodes" style={{maxWidth:"40rem"}}>
                <h2 style={{textAlign:"center"}} >Codelar</h2>

                {data.length === 0 ? <h2 style={{textAlign:"center",opacity:"0.7"}}>Data yo'q...</h2>:
                    
                    <div className="codes" style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                        {data.map((item) => (
                            <div key={item.id} className="code" style={{padding:"0 1rem",border:"1px solid black",borderRadius:"1rem"}}>

                                { openCode.includes(item.id) ?
                                <>
                                    <div style={{position:"relative",cursor:"pointer"}}>
                                        <h3 onClick={() => addremCodeId(item.id)} >{item.product_name}</h3>
                                        <span style={{position:"absolute", top:"50%",transform:"translateY(-50%)",right:"1rem"}}><FaAngleDown /></span>
                                    </div>


                                    <div style={{padding:"1.5rem",margin:"0.5rem",backgroundColor:"rgba(0,0,0,0.8)",borderRadius:"1rem",position:"relative"}}>
                                        <div>
                                            <button onClick={()=>{navigator.clipboard.writeText(item.code)}} style={{padding:"0.3rem",position:'absolute',right:"0.5rem",top:"0.5rem",transform:"scale(0.9)"}}><FaRegCopy /></button>
                                        </div>
                                        <div style={{whiteSpace:"pre",overflow:"auto",color:"#646cff"}}>
                                            {item.code}
                                        </div>
                                    </div>
                                </>
                                :
                                <div style={{position:"relative",cursor:"pointer"}}>
                                    <h3 onClick={() => addremCodeId(item.id)} >{item.product_name}</h3>
                                    <span style={{position:"absolute", top:"50%",transform:"translateY(-50%)",right:"1rem"}}><FaAngleRight/></span>
                                </div>

                                }

                            </div>
                        ))}
                    </div>

                }


            </div>
        </div>
        {modalOpen && <Modal isOpen={true} onClose={() => {setModalOpen(false)}}>
                <form onSubmit={handleSubmit} className="loginForm">

                    <input type="email" placeholder="Email" defaultValue={email} ref={emailRef} required />
                    <input type="password" placeholder="Parol" defaultValue={""} ref={passwordRef} required />
                    <input type="text" placeholder="Ism" defaultValue={fname} ref={firstNameRef} required />
                    <input type="text" placeholder="Familiya" defaultValue={lname} ref={lastNameRef} required />

                    <button type="submit">O'zgartirish</button>
                </form>

        </Modal>}

    </div>
  );
}
export default Dashboard;