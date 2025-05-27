import { useNavigate } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { FaRegTrashAlt,FaPlus } from "react-icons/fa";
import Modal from "../components/Modal";


function Admin() {
    const [load , setLoad] = useState(true);
    const navigate = useNavigate();
    useEffect (() => {
        // Tokenni tekshirish
        if(!localStorage.getItem("token")){
            navigate("/login");
        }
        // Admin rolini tekshirish
        console.log(localStorage.getItem("role"))
        if(localStorage.getItem("role") !== "admin"){
            navigate("/dashboard");
        }
        setLoad(false);
    },[]);

    // hamma product
    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    // product o'chirish
    const handleClick = (p_id) => {
        axios.delete(`http://localhost:8000/products/${p_id}`,{
            headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
        setProducts(products.filter(product => product.id !== p_id));
    }

    // modal && yangi code
    const [modalOpen, setModalOpen] = useState(false);

    const rname = useRef();
    const rprice = useRef();
    const rcode = useRef();



    const handleSabmit = async (event) => {
        event.preventDefault();

        const product_name = rname.current.value;
        const price = rprice.current.value;
        const code = rcode.current.value;

        // Form ma'lumotlarini yuborish
        try {
            const response = await fetch("http://127.0.0.1:8000/products/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ code,price,product_name }),
            });

            if (response.ok) {
                const responseData = await response.json();

                setProducts(prevItems => [...prevItems,responseData])

                console.log(responseData)
                rname.current.value = "";
                rprice.current.value = '';
                rcode.current.value = '';

            } else {
                console.error("Formni jo'natishda xatolik yuz berdi.");
            }
        } catch (error) {
            console.error("Tarmoq xatosi:", error);
        }


        setModalOpen(false);

    }



    if (load) return <h2>Yuklanyabdi...</h2>
  return (
    <div>
      <h1>Admin Sahifasi</h1>
            <h2>Mahsulotlar</h2>
            <div className='products'>
                <div className="product" style={{marginBottom:"1.5rem"}} onClick={()=>{setModalOpen(true)}}>
                    <h2>Yangi code</h2>
                    <div className="btn"  style={{marginLeft:"auto",borderColor:"#646cff"}}><FaPlus/></div>

                </div>
                {products && products.map((product) => (
                    <div className='product' key={product.id}>
                        <h2>{product.product_name}</h2>
                        <p style={{marginLeft:"1rem"}}>${product.price}</p>
                        <button onClick={() => {handleClick(product.id)}} style={{marginLeft:"auto",borderColor:"red"}}><FaRegTrashAlt /></button>
                    </div>
                ))}
        
            </div>
        {modalOpen && <Modal isOpen={true} onClose={() => {setModalOpen(false)}}>
            <form onSubmit={handleSabmit} className="loginForm">
                <h2>Yangi code ma'lumotlarini kiriting</h2>
                <input type="text" placeholder="Nomi" ref={rname} required />
                <input type="number" placeholder="Narxi" ref={rprice} required />
                <textarea name="code" id="code" placeholder="Code" ref={rcode} required ></textarea>

                <button style={{width:"100%",marginTop:"1rem"}}>Yaratish</button>
            </form>
        </Modal>}
    </div>
  );
}
export default Admin;
